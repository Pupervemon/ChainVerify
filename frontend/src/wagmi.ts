import { createConfig, http } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { sepolia } from 'wagmi/chains';
import type { EIP1193Provider } from 'viem';

export const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '3fcc6b144415893d5f22f036720f7796';

const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

type InjectedProvider = EIP1193Provider & {
  isMetaMask?: boolean;
  isBraveWallet?: boolean;
  isRabby?: boolean;
  isOkxWallet?: boolean;
  isOKExWallet?: boolean;
  providers?: InjectedProvider[];
  _events?: unknown;
  _state?: unknown;
};

const getInjectedProviders = (windowObject?: Window) => {
  const ethereum = windowObject?.ethereum as InjectedProvider | undefined;
  if (!ethereum) return [];
  if (Array.isArray(ethereum.providers) && ethereum.providers.length > 0) {
    return ethereum.providers;
  }
  return [ethereum];
};

const findInjectedProvider = (
  matcher: (provider: InjectedProvider) => boolean,
) => {
  return (windowObject?: Window) => {
    const providers = getInjectedProviders(windowObject);
    return providers.find(matcher);
  };
};

const isMetaMaskProvider = (provider: InjectedProvider) => {
  if (!provider.isMetaMask) return false;
  if (provider.isBraveWallet && !provider._events && !provider._state) return false;

  const masqueradingFlags = [
    'isRabby',
    'isOkxWallet',
    'isOKExWallet',
  ] as const;

  return !masqueradingFlags.some((flag) => provider[flag]);
};

const isRabbyProvider = (provider: InjectedProvider) => Boolean(provider.isRabby);
const isOkxProvider = (provider: InjectedProvider) => Boolean(provider.isOkxWallet || provider.isOKExWallet);

const cleanupWalletConnectStorage = () => {
  if (typeof window === 'undefined') return;

  const cleanupFlag = 'deproof:walletconnect-cleanup-v1';
  if (window.localStorage.getItem(cleanupFlag) === 'done') return;

  const keysToRemove: string[] = [];
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key) continue;

    if (
      key.startsWith('wc@2:') ||
      key.startsWith('WALLETCONNECT_') ||
      key.startsWith('@appkit/') ||
      key.startsWith('_walletConnectCore_') ||
      key.startsWith('reown:') ||
      key.includes('walletconnect')
    ) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
  window.localStorage.setItem(cleanupFlag, 'done');
};

cleanupWalletConnectStorage();

export const browserExtensionConnectorIds = ['metaMask', 'rabby', 'okxWallet', 'injected'] as const;

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected({
      target: {
        id: 'metaMask',
        name: 'MetaMask',
        provider: findInjectedProvider(isMetaMaskProvider),
      },
      unstable_shimAsyncInject: 2_000,
    }),
    injected({
      target: {
        id: 'rabby',
        name: 'Rabby',
        provider: findInjectedProvider(isRabbyProvider),
      },
      unstable_shimAsyncInject: 2_000,
    }),
    injected({
      target: {
        id: 'okxWallet',
        name: 'OKX Wallet',
        provider: findInjectedProvider(isOkxProvider),
      },
      unstable_shimAsyncInject: 2_000,
    }),
    injected({
      unstable_shimAsyncInject: 2_000,
    }),
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
      metadata: {
        name: 'DeProof',
        description: 'Decentralized proof notarization',
        url: appOrigin,
        icons: [],
      },
    }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
});
