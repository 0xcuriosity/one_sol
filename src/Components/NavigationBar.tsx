import { useState, useEffect, useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Wallet } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NetworkContext } from "../SolanaContextProvider";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
export default function Navbar() {
  const { network, setNetwork } = useContext(NetworkContext);
  useEffect(() => {
    console.log(network);
  }, [network]);
  const [isScrolled, setIsScrolled] = useState(false);
  const wallet = useWallet();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed p-4 top-0 left-64 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "backdrop-blur-lg bg-black/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-end gap-4">
            {wallet.publicKey && (
              <>
                <button
                  onClick={() => {
                    setNetwork(WalletAdapterNetwork.Mainnet);
                  }}
                  className={`
          px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2
          ${
            network === WalletAdapterNetwork.Mainnet
              ? "bg-white text-gray-950 shadow-md"
              : "bg-gray-800 text-gray-300 px-6 hover:bg-gray-600 "
          }
        `}
                >
                  {network === WalletAdapterNetwork.Mainnet && (
                    <div className="w-2 h-2 bg-green-700 rounded-full"></div>
                  )}
                  <span>Mainnet</span>
                </button>

                <button
                  onClick={() => {
                    setNetwork(WalletAdapterNetwork.Devnet);
                  }}
                  className={`
          px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2
          ${
            network === WalletAdapterNetwork.Devnet
              ? "bg-white text-gray-950 shadow-md"
              : "bg-gray-700 text-gray-300 px-6  hover:bg-gray-600"
          }
        `}
                >
                  {network === WalletAdapterNetwork.Devnet && (
                    <div className="w-2 h-2 bg-green-700 rounded-full"></div>
                  )}
                  <span>Devnet</span>
                </button>
              </>
            )}

            <WalletMultiButton>
              {!wallet.publicKey && (
                <>
                  <Wallet className="mr-2 mb-0.5 h-4 w-4" /> Connect Wallet
                </>
              )}
            </WalletMultiButton>
          </div>
        </div>
      </nav>
    </>
  );
}
