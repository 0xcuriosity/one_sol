import { useMemo, type ReactElement, useState, createContext } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
interface NetworkContextInterface {
  network: WalletAdapterNetwork;
  setNetwork: React.Dispatch<React.SetStateAction<WalletAdapterNetwork>>;
}
export const NetworkContext = createContext<NetworkContextInterface>({
  network: WalletAdapterNetwork.Devnet,
  setNetwork: () => {},
});
export const SolanaContext = ({ children }: { children: ReactElement }) => {
  // You can also provide a custom RPC endpoint.
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <NetworkContext.Provider value={{ network, setNetwork }}>
          <WalletModalProvider>{children}</WalletModalProvider>
        </NetworkContext.Provider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
