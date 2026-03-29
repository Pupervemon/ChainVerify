import type { ChangeEvent, MouseEvent, RefObject } from "react";
import { Loader2, Search, ShieldCheck, Upload, X } from "lucide-react";

type HomePageProps = {
  file: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  isConnected: boolean;
  isTxConfirming: boolean;
  isUploading: boolean;
  onClearFile: (event: MouseEvent) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void | Promise<void>;
  onVerify: () => void | Promise<void>;
};

export default function HomePage(props: HomePageProps) {
  const {
    file,
    fileInputRef,
    isConnected,
    isTxConfirming,
    isUploading,
    onClearFile,
    onFileChange,
    onUpload,
    onVerify,
  } = props;

  return (
    <main className="relative flex flex-col items-center px-4 pb-48 pt-32">
      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-12">
        <header className="mb-12 text-center">
          <h1 className="mb-6 text-[3.5rem] font-extrabold leading-[1.1] tracking-[-0.03em]">
            Your Immutable Digital Notary.
          </h1>
          <p className="text-xl font-medium text-slate-500">
            Verify and timestamp any digital asset with cryptographic certainty.
          </p>
        </header>

        <div
          className={`group relative flex flex-col items-center justify-center gap-8 rounded-[3rem] border-2 border-dashed px-12 py-20 transition-all ${
            file
              ? "border-primary-200 bg-primary-50/40"
              : "border-slate-100 bg-transparent hover:bg-slate-50/50"
          }`}
        >
          {file && (
            <button
              onClick={onClearFile}
              className="absolute right-6 top-6 z-20 flex items-center justify-center rounded-full border border-slate-100 bg-white p-2 text-slate-400 shadow-sm transition-all hover:border-red-100 hover:text-red-500"
              title="Remove file"
            >
              <X size={20} />
            </button>
          )}

          <div
            className={`flex h-28 w-28 items-center justify-center rounded-[2.5rem] shadow-2xl transition-all ${
              file
                ? "scale-105 bg-primary-600 text-white"
                : "bg-white text-slate-300 group-hover:scale-105 group-hover:text-primary-400"
            }`}
          >
            <Upload size={56} />
          </div>

          <div className="space-y-2 text-center">
            <p className="line-clamp-1 px-4 text-2xl font-extrabold text-slate-900">
              {file ? file.name : "Drag and drop file here"}
            </p>
            <p className="text-[15px] font-bold uppercase tracking-widest text-slate-400">
              {file ? `${(file.size / 1024).toFixed(2)} KB` : "or click to upload"}
            </p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            id="file-upload"
            className="hidden"
            onChange={onFileChange}
          />
          <label htmlFor="file-upload" className="absolute inset-0 z-10 cursor-pointer" />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onUpload}
            disabled={isUploading || !file || !isConnected}
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl bg-primary-600 py-6 font-black uppercase text-white shadow-lg transition-all hover:bg-primary-700 disabled:bg-slate-100"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
            {isTxConfirming ? "Securing..." : "Notarize"}
          </button>
          <button
            onClick={onVerify}
            disabled={isUploading || !file}
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl border-2 border-slate-100 bg-white py-6 font-black uppercase text-slate-900 transition-all hover:border-primary-600"
          >
            <Search />
            Verify
          </button>
        </div>
      </div>
    </main>
  );
}
