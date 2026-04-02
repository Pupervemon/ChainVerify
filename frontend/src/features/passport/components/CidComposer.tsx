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
  framed?: boolean;
  formFields?: CidComposerFormField[];
  suggestedFileName: string;
  value: string;
  onChange: (value: string) => void;
};

const EMPTY_FORM_FIELDS: CidComposerFormField[] = [];

const accentStyles: Record<
  Accent,
  {
    activeButton: string;
    button: string;
    focus: string;
  }
> = {
  emerald: {
    activeButton: "border-emerald-300 bg-emerald-50 text-emerald-700",
    button: "hover:border-emerald-300/60 hover:text-emerald-700",
    focus: "focus:border-emerald-400 focus:shadow-[inset_0_0_0_1px_#34d399]",
  },
  orange: {
    activeButton: "border-orange-300 bg-orange-50 text-orange-700",
    button: "hover:border-orange-300/60 hover:text-orange-700",
    focus: "focus:border-orange-400 focus:shadow-[inset_0_0_0_1px_#fb923c]",
  },
  rose: {
    activeButton: "border-rose-300 bg-rose-50 text-rose-700",
    button: "hover:border-rose-300/60 hover:text-rose-700",
    focus: "focus:border-rose-400 focus:shadow-[inset_0_0_0_1px_#fb7185]",
  },
  sky: {
    activeButton: "border-sky-300 bg-sky-50 text-sky-700",
    button: "hover:border-sky-300/60 hover:text-sky-700",
    focus: "focus:border-sky-400 focus:shadow-[inset_0_0_0_1px_#60a5fa]",
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
    framed = true,
    formFields = EMPTY_FORM_FIELDS,
    suggestedFileName,
    value,
    onChange,
  } = props;
  const { t } = usePassportLocale();
  const styles = accentStyles[accent];
  const hasForm = formFields.length > 0;
  const fieldControlClassName = `mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition-all ${styles.focus}`;
  const frameClassName = framed ? "panel-soft h-auto min-h-0 justify-start p-5" : "";

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
    <div className={frameClassName}>
      {description ? (
        <div className="border-b border-slate-200 pb-5">
          <p className="meta-label">{t("CID Composer", "CID Composer")}</p>
          <p className="mt-3 max-w-3xl text-sm font-medium text-slate-600">{description}</p>
        </div>
      ) : null}

      <div className={`${description ? "mt-5 " : ""}flex flex-wrap gap-3`}>
        {hasForm ? (
          <button
            type="button"
            onClick={() => setMode("form")}
            className={`inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-all ${
              mode === "form"
                ? styles.activeButton
                : `border-slate-200 bg-white text-slate-700 ${styles.button}`
            }`}
          >
            {t("表单填写", "Form")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setMode("json")}
          className={`inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-all ${
            mode === "json"
              ? styles.activeButton
              : `border-slate-200 bg-white text-slate-700 ${styles.button}`
          }`}
        >
          JSON
        </button>
        <button
          type="button"
          onClick={() => setMode("file")}
          className={`inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-all ${
            mode === "file"
              ? styles.activeButton
              : `border-slate-200 bg-white text-slate-700 ${styles.button}`
          }`}
        >
          {t("上传文件", "Upload File")}
        </button>
      </div>

      {mode === "form" && hasForm ? (
        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {formFields.map((field) => {
              const fieldType = field.type ?? "text";
              const isWide = fieldType !== "text";

              return (
                <div
                  key={field.key}
                  className={`panel-soft h-auto min-h-0 justify-start p-5 ${isWide ? "md:col-span-2" : ""}`}
                >
                  <label className="meta-label">{field.label}</label>
                  {fieldType === "textarea" || fieldType === "list" ? (
                    <textarea
                      value={formState[field.key] ?? ""}
                      onChange={(event) => handleFormValueChange(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      rows={fieldType === "list" ? 4 : 5}
                      className={`${fieldControlClassName} resize-y`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formState[field.key] ?? ""}
                      onChange={(event) => handleFormValueChange(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className={`passport-dashboard-query__input mt-3 h-12 ${styles.focus}`}
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
            <div className="panel-soft h-auto min-h-0 justify-start p-5">
              <p className="meta-label">{t("文件名", "File Name")}</p>
              <input
                type="text"
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                placeholder={suggestedFileName}
                className={`passport-dashboard-query__input mt-3 h-12 ${styles.focus}`}
              />
            </div>
            <div className="panel-soft h-auto min-h-0 justify-start p-5">
              <p className="meta-label">{t("内容类型", "Content Type")}</p>
              <select
                value={mimeType}
                onChange={(event) => setMimeType(event.target.value)}
                className={`passport-dashboard-query__input mt-3 h-12 ${styles.focus}`}
              >
                <option value="application/json">application/json</option>
                <option value="text/plain">text/plain</option>
                <option value="text/markdown">text/markdown</option>
              </select>
            </div>
          </div>
        </div>
      ) : null}

      {mode === "json" ? (
        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
            <div className="panel-soft h-auto min-h-0 justify-start p-5">
              <p className="meta-label">{t("文件名", "File Name")}</p>
              <input
                type="text"
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                placeholder={suggestedFileName}
                className={`passport-dashboard-query__input mt-3 h-12 ${styles.focus}`}
              />
            </div>
            <div className="panel-soft h-auto min-h-0 justify-start p-5">
              <p className="meta-label">{t("内容类型", "Content Type")}</p>
              <select
                value={mimeType}
                onChange={(event) => setMimeType(event.target.value)}
                className={`passport-dashboard-query__input mt-3 h-12 ${styles.focus}`}
              >
                <option value="application/json">application/json</option>
                <option value="text/plain">text/plain</option>
                <option value="text/markdown">text/markdown</option>
              </select>
            </div>
          </div>
          <div className="panel-soft h-auto min-h-0 justify-start p-5">
            <p className="meta-label">JSON</p>
            <textarea
              value={textContent}
              onChange={(event) => handleJsonValueChange(event.target.value)}
              rows={12}
              className={`mt-3 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none transition-all ${styles.focus}`}
            />
          </div>
          {jsonValidationError ? (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-700">
              {jsonValidationError}
            </div>
          ) : null}
        </div>
      ) : null}

      {mode === "file" ? (
        <div className="mt-6 grid gap-4">
          <div className="panel-soft h-auto min-h-0 justify-start p-5">
            <p className="meta-label">{t("文件上传", "File Upload")}</p>
            <label
              className={`mt-3 flex min-h-[160px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center transition-all ${styles.button}`}
            >
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
                    : t("点击选择文件", "Click to choose a file")}
                </p>
                {selectedFile ? (
                  <p className="text-xs font-medium text-slate-500">
                    {`${(selectedFile.size / 1024).toFixed(2)} KB`}
                  </p>
                ) : null}
              </div>
            </label>
          </div>
        </div>
      ) : null}

      <div className="passport-dashboard-primary__actions mt-6">
        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={isUploading || Boolean(jsonValidationError && mode !== "file")}
          className="passport-action-button passport-action-button--primary disabled:opacity-50"
        >
          {isUploading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {isUploading ? t("生成中...", "Generating...") : t("生成 CID", "Generate CID")}
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          className={`passport-action-button passport-action-button--secondary ${styles.button}`}
        >
          {t("清空当前字段", "Clear Current Field")}
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="panel-soft h-auto min-h-0 justify-start p-5">
          <p className="meta-label">{t("当前字段值", "Current Field Value")}</p>
          <p className="mt-3 break-all font-mono text-sm font-semibold text-slate-700">
            {resolvedCidValue || t("尚未填写", "Empty")}
          </p>
        </div>
        {gatewayUrl ? (
          <div className="panel-soft h-auto min-h-0 justify-start p-5">
            <p className="meta-label">{t("网关预览", "Gateway Preview")}</p>
            <a
              href={gatewayUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
            >
              <Link2 size={14} />
              {gatewayUrl}
            </a>
          </div>
        ) : null}
      </div>

      {statusMessage ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {statusMessage}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}
