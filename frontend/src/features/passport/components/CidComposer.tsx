import { FileUp, Link2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { uploadCidFile } from "../api/cidApi";
import { usePassportLocale } from "../i18n";

type Accent = "sky" | "orange" | "emerald" | "rose";
type Mode = "text" | "file";

type CidComposerProps = {
  accent?: Accent;
  defaultText?: string;
  description?: string;
  fieldKey: string;
  suggestedFileName: string;
  value: string;
  onChange: (value: string) => void;
};

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

export default function CidComposer(props: CidComposerProps) {
  const {
    accent = "sky",
    defaultText = "{\n  \n}",
    description,
    fieldKey,
    suggestedFileName,
    value,
    onChange,
  } = props;
  const { t } = usePassportLocale();
  const styles = accentStyles[accent];
  const [mode, setMode] = useState<Mode>("text");
  const [textContent, setTextContent] = useState(defaultText);
  const [fileName, setFileName] = useState(suggestedFileName);
  const [mimeType, setMimeType] = useState("application/json");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [lastCid, setLastCid] = useState("");
  const [gatewayUrl, setGatewayUrl] = useState("");

  useEffect(() => {
    setTextContent(defaultText);
  }, [defaultText]);

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
      if (!textContent.trim()) {
        setError(t("请输入要生成 CID 的内容。", "Enter content to generate a CID."));
        return;
      }

      const resolvedFileName = fileName.trim() || suggestedFileName;
      uploadFile = new File([textContent], resolvedFileName, { type: mimeType });
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
    <div className={`mt-4 rounded-2xl border px-5 py-5 ${styles.panel}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${styles.badge}`}>
            {t("页面内生成 CID", "Generate CID In Page")}
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {description ||
              t(
                "可以直接在这里上传文件，或把 JSON / 文本内容转成文件后上传到 IPFS，成功后会自动回填当前表单字段。",
                "Upload a file here, or turn JSON/text into a file and upload it to IPFS. The current form field will be filled automatically after success.",
              )}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${
            mode === "text"
              ? "border border-sky-200 bg-sky-50 text-sky-700"
              : `border border-slate-200 bg-white text-slate-700 ${styles.button}`
          }`}
        >
          {t("文本 / JSON", "Text / JSON")}
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

      {mode === "text" ? (
        <div className="mt-4 grid gap-4">
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
            onChange={(event) => setTextContent(event.target.value)}
            rows={8}
            className={`w-full resize-y rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all ${styles.ring}`}
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4">
          <label className={`flex min-h-[112px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center transition-all ${styles.button}`}>
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
                  : t("点击选择一个要上传到 IPFS 的文件", "Click to choose a file to upload to IPFS")}
              </p>
              {selectedFile ? (
                <p className="text-xs font-medium text-slate-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              ) : null}
            </div>
          </label>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-sky-700 transition-all hover:bg-sky-100 disabled:opacity-50"
        >
          {isUploading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {isUploading ? t("生成中...", "Generating...") : t("生成并回填 CID", "Generate And Fill CID")}
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          className={`inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-700 transition-all ${styles.button}`}
        >
          {t("清空当前字段", "Clear Current Field")}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4">
          <p className="meta-label">{t("当前字段值", "Current Field Value")}</p>
          <p className="mt-2 break-all font-mono text-sm text-slate-700">
            {resolvedCidValue || t("尚未填写", "Empty")}
          </p>
        </div>
        {gatewayUrl ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-4">
            <p className="meta-label">{t("网关预览", "Gateway Preview")}</p>
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
