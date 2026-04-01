import { FileUp, Link2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { uploadCidFile } from "../api/cidApi";
import { usePassportLocale } from "../i18n";

type Accent = "sky" | "orange" | "emerald" | "rose";
type Mode = "form" | "json" | "file";
type FormFieldType = "text" | "textarea" | "list";

export type CidComposerFormField = {
  helper?: string;
  key: string;
  label: string;
  placeholder?: string;
  type?: FormFieldType;
};

type CidComposerProps = {
  accent?: Accent;
  defaultPayload?: Record<string, unknown>;
  defaultText?: string;
  description?: string;
  fieldKey: string;
  formFields?: CidComposerFormField[];
  suggestedFileName: string;
  value: string;
  onChange: (value: string) => void;
};

const EMPTY_FORM_FIELDS: CidComposerFormField[] = [];

const accentStyles: Record<
  Accent,
  {
    badge: string;
    button: string;
    panel: string;
    ring: string;
  }
> = {
  emerald: {
    badge: "bg-emerald-100 text-emerald-700",
    button: "hover:border-emerald-200 hover:text-emerald-700",
    panel: "border-emerald-100 bg-emerald-50",
    ring: "focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100",
  },
  orange: {
    badge: "bg-orange-100 text-orange-700",
    button: "hover:border-orange-200 hover:text-orange-700",
    panel: "border-orange-100 bg-orange-50",
    ring: "focus:border-orange-300 focus:ring-4 focus:ring-orange-100",
  },
  rose: {
    badge: "bg-rose-100 text-rose-700",
    button: "hover:border-rose-200 hover:text-rose-700",
    panel: "border-rose-100 bg-rose-50",
    ring: "focus:border-rose-300 focus:ring-4 focus:ring-rose-100",
  },
  sky: {
    badge: "bg-sky-100 text-sky-700",
    button: "hover:border-sky-200 hover:text-sky-700",
    panel: "border-sky-100 bg-sky-50",
    ring: "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
  },
};

function prettyStringify(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function normalizePayload(defaultPayload?: Record<string, unknown>, defaultText?: string) {
  if (defaultPayload) {
    return defaultPayload;
  }

  if (defaultText?.trim()) {
    try {
      return JSON.parse(defaultText) as Record<string, unknown>;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function payloadToFormState(fields: CidComposerFormField[], payload?: Record<string, unknown>) {
  return fields.reduce<Record<string, string>>((accumulator, field) => {
    const value = payload?.[field.key];

    if (field.type === "list") {
      accumulator[field.key] = Array.isArray(value)
        ? value.map((item) => String(item)).join("\n")
        : "";
      return accumulator;
    }

    accumulator[field.key] =
      typeof value === "string"
        ? value
        : value === undefined || value === null
          ? ""
          : String(value);

    return accumulator;
  }, {});
}

function formStateToPayload(fields: CidComposerFormField[], formState: Record<string, string>) {
  return fields.reduce<Record<string, unknown>>((accumulator, field) => {
    const currentValue = formState[field.key] ?? "";

    if (field.type === "list") {
      accumulator[field.key] = currentValue
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      return accumulator;
    }

    accumulator[field.key] = currentValue.trim();
    return accumulator;
  }, {});
}

export default function CidComposer(props: CidComposerProps) {
  const {
    accent = "sky",
    defaultPayload,
    defaultText = "{\n  \n}",
    description,
    fieldKey,
    formFields = EMPTY_FORM_FIELDS,
    suggestedFileName,
    value,
    onChange,
  } = props;
  const { t } = usePassportLocale();
  const styles = accentStyles[accent];
  const hasForm = formFields.length > 0;

  const [mode, setMode] = useState<Mode>(hasForm ? "form" : "json");
  const [textContent, setTextContent] = useState(defaultText);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [fileName, setFileName] = useState(suggestedFileName);
  const [mimeType, setMimeType] = useState("application/json");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [lastCid, setLastCid] = useState("");
  const [gatewayUrl, setGatewayUrl] = useState("");

  useEffect(() => {
    const payload = normalizePayload(defaultPayload, defaultText);
    const nextText = payload ? prettyStringify(payload) : defaultText;

    setTextContent(nextText);
    setFormState(hasForm ? payloadToFormState(formFields, payload) : {});
    setMode(hasForm ? "form" : "json");
  }, [defaultPayload, defaultText, formFields, hasForm]);

  useEffect(() => {
    setFileName(suggestedFileName);
  }, [suggestedFileName]);

  const resolvedCidValue = useMemo(() => {
    if (value.trim()) {
      return value.trim();
    }

    if (lastCid) {
      return `ipfs://${lastCid}`;
    }

    return "";
  }, [lastCid, value]);

  const jsonValidationError = useMemo(() => {
    if (mode === "file" || mimeType !== "application/json" || !textContent.trim()) {
      return "";
    }

    try {
      JSON.parse(textContent);
      return "";
    } catch {
      return t("JSON 格式不正确，请先修正后再生成。", "Invalid JSON. Fix it before generating.");
    }
  }, [mimeType, mode, t, textContent]);

  const handleFormValueChange = (key: string, nextValue: string) => {
    const nextState = {
      ...formState,
      [key]: nextValue,
    };

    setFormState(nextState);
    setTextContent(prettyStringify(formStateToPayload(formFields, nextState)));
  };

  const handleJsonValueChange = (nextValue: string) => {
    setTextContent(nextValue);

    if (!hasForm) {
      return;
    }

    try {
      const parsed = JSON.parse(nextValue) as Record<string, unknown>;
      setFormState(payloadToFormState(formFields, parsed));
    } catch {
      // Keep the last valid form state so the form mode remains usable.
    }
  };

  const handleUpload = async () => {
    setError("");
    setStatusMessage("");

    let uploadFile: File | null = null;

    if (mode === "file") {
      if (!selectedFile) {
        setError(t("请先选择一个文件。", "Select a file first."));
        return;
      }

      uploadFile = selectedFile;
    } else {
      const resolvedFileName = fileName.trim() || suggestedFileName;
      const resolvedText =
        mode === "form" ? prettyStringify(formStateToPayload(formFields, formState)) : textContent;

      if (!resolvedText.trim()) {
        setError(t("请先填写要生成 CID 的内容。", "Enter content before generating a CID."));
        return;
      }

      if (mimeType === "application/json") {
        try {
          JSON.parse(resolvedText);
        } catch {
          setError(t("JSON 格式不正确，请先修正后再生成。", "Invalid JSON. Fix it before generating."));
          return;
        }
      }

      uploadFile = new File([resolvedText], resolvedFileName, { type: mimeType });
    }

    setIsUploading(true);
    setStatusMessage(t("正在上传到 IPFS 并生成 CID...", "Uploading to IPFS and generating a CID..."));

    try {
      const result = await uploadCidFile(uploadFile, {
        metadata: {
          field: fieldKey,
          module: "passport",
        },
      });

      setLastCid(result.cid);
      setGatewayUrl(result.gateway_url);
      onChange(`ipfs://${result.cid}`);
      setStatusMessage(
        t(`CID 已生成并回填：ipfs://${result.cid}`, `CID generated and filled: ipfs://${result.cid}`),
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : t("生成 CID 失败。", "Failed to generate CID."),
      );
      setStatusMessage("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`mt-4 rounded-[1.75rem] border px-5 py-5 ${styles.panel}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${styles.badge}`}>
            {t("页内生成 CID", "Generate CID In Page")}
          </div>
          <p className="text-sm font-semibold leading-relaxed text-slate-800">
            {description ||
              t(
                "默认用表单组织内容，必要时再切换到 JSON 或文件上传模式。",
                "Use the structured form by default, and switch to JSON or file upload only when needed.",
              )}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {hasForm ? (
          <button
            type="button"
            onClick={() => setMode("form")}
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${
              mode === "form"
                ? "border border-sky-200 bg-sky-50 text-sky-700"
                : `border border-slate-200 bg-white text-slate-700 ${styles.button}`
            }`}
          >
            {t("表单填写", "Form")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setMode("json")}
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${
            mode === "json"
              ? "border border-sky-200 bg-sky-50 text-sky-700"
              : `border border-slate-200 bg-white text-slate-700 ${styles.button}`
          }`}
        >
          JSON
        </button>
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${
            mode === "file"
              ? "border border-sky-200 bg-sky-50 text-sky-700"
              : `border border-slate-200 bg-white text-slate-700 ${styles.button}`
          }`}
        >
          {t("上传文件", "Upload File")}
        </button>
      </div>

      {mode === "form" && hasForm ? (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {formFields.map((field) => {
              const fieldType = field.type ?? "text";
              const isWide = fieldType !== "text";
              const commonClassName = `mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all ${styles.ring}`;

              return (
                <div
                  key={field.key}
                  className={`rounded-2xl border border-white/70 bg-white/70 px-4 py-4 ${isWide ? "md:col-span-2" : ""}`}
                >
                  <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    {field.label}
                  </label>
                  {fieldType === "textarea" || fieldType === "list" ? (
                    <textarea
                      value={formState[field.key] ?? ""}
                      onChange={(event) => handleFormValueChange(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      rows={fieldType === "list" ? 4 : 5}
                      className={`${commonClassName} resize-y`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formState[field.key] ?? ""}
                      onChange={(event) => handleFormValueChange(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className={commonClassName}
                    />
                  )}
                  {field.helper ? (
                    <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">{field.helper}</p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              placeholder={suggestedFileName}
              className={`rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all ${styles.ring}`}
            />
            <select
              value={mimeType}
              onChange={(event) => setMimeType(event.target.value)}
              className={`rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all ${styles.ring}`}
            >
              <option value="application/json">application/json</option>
              <option value="text/plain">text/plain</option>
              <option value="text/markdown">text/markdown</option>
            </select>
          </div>
        </div>
      ) : null}

      {mode === "json" ? (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              placeholder={suggestedFileName}
              className={`rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all ${styles.ring}`}
            />
            <select
              value={mimeType}
              onChange={(event) => setMimeType(event.target.value)}
              className={`rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all ${styles.ring}`}
            >
              <option value="application/json">application/json</option>
              <option value="text/plain">text/plain</option>
              <option value="text/markdown">text/markdown</option>
            </select>
          </div>
          <textarea
            value={textContent}
            onChange={(event) => handleJsonValueChange(event.target.value)}
            rows={12}
            className={`w-full resize-y rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all ${styles.ring}`}
          />
          {jsonValidationError ? (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-700">
              {jsonValidationError}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 text-sm font-medium text-slate-500">
              {t(
                "适合高级用户或直接粘贴现成 metadata。JSON 合法时会同步回表单。",
                "For advanced users or prebuilt metadata. Valid JSON is synced back into the form.",
              )}
            </div>
          )}
        </div>
      ) : null}

      {mode === "file" ? (
        <div className="mt-5 grid gap-4">
          <label className={`flex min-h-[132px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center transition-all ${styles.button}`}>
            <input
              type="file"
              className="hidden"
              onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            />
            <div className="space-y-2">
              <div className="flex justify-center text-slate-500">
                <FileUp size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {selectedFile
                  ? selectedFile.name
                  : t("点击选择一个文件并直接上传到 IPFS", "Click to choose a file and upload it to IPFS")}
              </p>
              <p className="text-xs font-medium text-slate-500">
                {selectedFile
                  ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                  : t("适合图片、PDF、现成 JSON 或其他附件。", "Best for images, PDFs, ready-made JSON, or other attachments.")}
              </p>
            </div>
          </label>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={isUploading || Boolean(jsonValidationError && mode !== "file")}
          className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-sky-700 transition-all hover:bg-sky-100 disabled:opacity-50"
        >
          {isUploading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {isUploading ? t("生成中...", "Generating...") : t("生成 CID", "Generate CID")}
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          className={`inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-700 transition-all ${styles.button}`}
        >
          {t("清空当前字段", "Clear Current Field")}
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            {t("当前字段值", "Current Field Value")}
          </p>
          <p className="mt-2 break-all font-mono text-sm text-slate-700">
            {resolvedCidValue || t("尚未填写", "Empty")}
          </p>
        </div>
        {gatewayUrl ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              {t("网关预览", "Gateway Preview")}
            </p>
            <a
              href={gatewayUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 break-all text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
            >
              <Link2 size={14} />
              {gatewayUrl}
            </a>
          </div>
        ) : null}
        {statusMessage ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-700">
            {statusMessage}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
