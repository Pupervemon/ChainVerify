import React, { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Banner from "./components/Banner";
import AppNavigation from "./components/AppNavigation";
import Toast from "./components/Toast";
import WalletConnectionNotice from "./components/WalletConnectionNotice";
import { useProofWorkspace } from "./features/proof/hooks/useProofWorkspace";
import { useWalletSession } from "./hooks/useWalletSession";
import type { ToastState, ToastVariant } from "./types/toast";

const HomePage = lazy(() => import("./features/proof/pages/HomePage"));
const DashboardPage = lazy(() => import("./features/proof/pages/DashboardPage"));
const PassportDashboardPage = lazy(() => import("./features/passport/pages/PassportDashboardPage"));
const PassportWorkbenchPage = lazy(() => import("./features/passport/pages/PassportWorkbenchPage"));
const PassportTrustedFactoryPage = lazy(
  () => import("./features/passport/pages/PassportTrustedFactoryPage"),
);
const PassportAdminPage = lazy(() => import("./features/passport/pages/PassportAdminPage"));
const PassportCreatePage = lazy(() => import("./features/passport/pages/PassportCreatePage"));
const PassportIssuerPolicyPage = lazy(
  () => import("./features/passport/pages/PassportIssuerPolicyPage"),
);
const PassportIssueStampPage = lazy(
  () => import("./features/passport/pages/PassportIssueStampPage"),
);
const PassportRevokeStampPage = lazy(
  () => import("./features/passport/pages/PassportRevokeStampPage"),
);
const PassportRevocationOperatorPage = lazy(
  () => import("./features/passport/pages/PassportRevocationOperatorPage"),
);
const PassportStampTypeAdminPage = lazy(
  () => import("./features/passport/pages/PassportStampTypeAdminPage"),
);
const PassportStampTypePermissionPage = lazy(
  () => import("./features/passport/pages/PassportStampTypePermissionPage"),
);
const PassportDetailPage = lazy(() => import("./features/passport/pages/PassportDetailPage"));
const CidStudioPage = lazy(() => import("./pages/CidStudioPage"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const ProofPage = lazy(() => import("./pages/ProofPage"));

function RouteLoadingFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6 py-16">
      <div className="rounded-[2rem] border border-slate-100 bg-white px-8 py-6 text-center shadow-sm">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">
          Loading Route
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-700">
          Preparing the next module view...
        </p>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [statusToast, setStatusToast] = useState<ToastState | null>(null);
  const [walletConnectionNotice, setWalletConnectionNotice] = useState<{
    id: number;
    message: string;
  } | null>(null);
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    activeWalletIcon,
    activeWalletName,
    accountMenuRef,
    blockNumber,
    connectedAddress,
    currentChainName,
    disconnect,
    ensureSupportedChain,
    hasCorrectChain,
    isAccountMenuOpen,
    isConnected,
    isSwitchingChain,
    openConnectModal,
    revokeWalletAuthorization,
    setIsAccountMenuOpen,
    targetChainName,
    truncateAddress,
  } = useWalletSession({
    onStatusChange: setStatusToast,
    onWalletConnected: (message) =>
      setWalletConnectionNotice({
        id: Date.now(),
        message,
      }),
  });

  const {
    currentPage,
    fetchProofs,
    file,
    fileInputRef,
    handleFileChange,
    handleUpload,
    handleVerify,
    isLoadingProofs,
    isUploading,
    isTxConfirming,
    proofs,
    resetSelectedFile,
    setVerificationResult,
    verificationResult,
  } = useProofWorkspace({
    address: connectedAddress,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
    onStatusChange: setStatusToast,
  });

  const isProofPage = location.pathname.startsWith("/proof/");

  useEffect(() => {
    if (location.pathname === "/dashboard" && isConnected) {
      void fetchProofs(1);
    }
  }, [fetchProofs, isConnected, location.pathname]);

  useEffect(() => {
    if (verificationResult.status !== "success" || !verificationResult.proof) {
      return;
    }

    const timer = setTimeout(
      () => {
        setVerificationResult({ status: "idle" });
        navigate(`/proof/${verificationResult.proof?.file_hash}`);
      },
      1500,
    );
    return () => clearTimeout(timer);
  }, [navigate, setVerificationResult, verificationResult]);

  const handleClearFile = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    resetSelectedFile();
  };

  let verificationToastMessage = "";
  let verificationToastVariant: ToastVariant = "info";

  if (verificationResult.status === "verifying") {
    verificationToastMessage = "Verifying file fingerprint...";
    verificationToastVariant = "loading";
  } else if (verificationResult.status === "success") {
    verificationToastMessage = verificationResult.message ?? "";
    verificationToastVariant = "success";
  } else if (verificationResult.status === "mismatch" || verificationResult.status === "error") {
    verificationToastMessage = verificationResult.message ?? "";
    verificationToastVariant = "error";
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#111827]">
      {!isProofPage && <Banner />}

      {!isProofPage && (
        <AppNavigation
          activeWalletIcon={activeWalletIcon}
          activeWalletName={activeWalletName}
          connectedAddress={connectedAddress}
          isAccountMenuOpen={isAccountMenuOpen}
          isConnected={isConnected}
          navSearchQuery={navSearchQuery}
          onConnect={() => openConnectModal?.()}
          onDisconnect={async () => {
            await revokeWalletAuthorization();
            disconnect();
            setIsAccountMenuOpen(false);
          }}
          onNavSearchQueryChange={setNavSearchQuery}
          onToggleAccountMenu={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
          pathname={location.pathname}
          setAccountMenuRef={(element) => {
            accountMenuRef.current = element;
          }}
          truncateAddress={truncateAddress}
        />
      )}

      <Toast
        message={statusToast?.message ?? ""}
        variant={statusToast?.variant}
        onClose={() => setStatusToast(null)}
      />
      <WalletConnectionNotice
        key={walletConnectionNotice?.id ?? "wallet-connection-notice"}
        message={walletConnectionNotice?.message ?? ""}
        onClose={() => setWalletConnectionNotice(null)}
      />
      <Toast
        message={verificationToastMessage}
        variant={verificationToastVariant}
        topClassName={statusToast ? "top-40" : "top-24"}
        onClose={() => setVerificationResult({ status: "idle" })}
      />

      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                file={file}
                fileInputRef={fileInputRef}
                isConnected={isConnected}
                isTxConfirming={isTxConfirming}
                isUploading={isUploading}
                onClearFile={handleClearFile}
                onFileChange={handleFileChange}
                onUpload={handleUpload}
                onVerify={handleVerify}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                address={connectedAddress}
                currentPage={currentPage}
                isLoadingProofs={isLoadingProofs}
                onRefresh={fetchProofs}
                proofs={proofs}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            }
          />
          <Route path="/passport" element={<PassportDashboardPage />} />
          <Route path="/passport/workbench" element={<PassportWorkbenchPage />} />
          <Route
            path="/passport/factories"
            element={
              <PassportTrustedFactoryPage
                connectedAddress={connectedAddress}
                ensureSupportedChain={ensureSupportedChain}
                hasCorrectChain={hasCorrectChain}
                isConnected={isConnected}
              />
            }
          />
          <Route
            path="/passport/admin"
            element={
              <PassportAdminPage
                connectedAddress={connectedAddress}
                ensureSupportedChain={ensureSupportedChain}
                hasCorrectChain={hasCorrectChain}
                isConnected={isConnected}
              />
            }
          />
          <Route
            path="/passport/create"
            element={
              <PassportCreatePage
                connectedAddress={connectedAddress}
                ensureSupportedChain={ensureSupportedChain}
                hasCorrectChain={hasCorrectChain}
                isConnected={isConnected}
              />
            }
          />
          <Route
            path="/passport/policies"
            element={
              <PassportIssuerPolicyPage
                connectedAddress={connectedAddress}
                ensureSupportedChain={ensureSupportedChain}
                hasCorrectChain={hasCorrectChain}
                isConnected={isConnected}
              />
            }
          />
          <Route
            path="/passport/issue"
            element={
              <PassportIssueStampPage
                connectedAddress={connectedAddress}
                currentChainName={currentChainName}
                ensureSupportedChain={ensureSupportedChain}
                hasCorrectChain={hasCorrectChain}
                isConnected={isConnected}
                targetChainName={targetChainName}
              />
            }
          />
          <Route
            path="/passport/revoke"
            element={
              <PassportRevokeStampPage
                connectedAddress={connectedAddress}
                ensureSupportedChain={ensureSupportedChain}
                hasCorrectChain={hasCorrectChain}
                isConnected={isConnected}
              />
            }
          />
          <Route
            path="/passport/revocation-operators"
            element={
              <PassportRevocationOperatorPage
                connectedAddress={connectedAddress}
                ensureSupportedChain={ensureSupportedChain}
                hasCorrectChain={hasCorrectChain}
                isConnected={isConnected}
              />
            }
          />
          <Route
            path="/passport/stamp-types"
            element={
              <PassportStampTypeAdminPage
                connectedAddress={connectedAddress}
                currentChainName={currentChainName}
                ensureSupportedChain={ensureSupportedChain}
                hasCorrectChain={hasCorrectChain}
                isConnected={isConnected}
                targetChainName={targetChainName}
              />
            }
          />
          <Route
            path="/passport/stamp-type-admins"
            element={
              <PassportStampTypePermissionPage
                connectedAddress={connectedAddress}
                ensureSupportedChain={ensureSupportedChain}
                hasCorrectChain={hasCorrectChain}
                isConnected={isConnected}
              />
            }
          />
          <Route path="/passport/cid-studio" element={<CidStudioPage />} />
          <Route path="/passport/:passportId" element={<PassportDetailPage />} />
          <Route path="/cid-studio" element={<Navigate to="/passport/cid-studio" replace />} />
          <Route path="/doc" element={<DocsPage />} />
          <Route path="/doc/:slug" element={<DocsPage />} />
          <Route path="/proof/:hash" element={<ProofPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
