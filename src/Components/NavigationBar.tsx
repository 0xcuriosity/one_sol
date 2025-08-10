import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
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
          <div className="flex items-center justify-end">
            {/* Logo on the left */}

            {/* Select Wallet Button on the right */}

            <WalletMultiButton>
              <Wallet className="mr-2 mb-0.5 h-4 w-4" /> Connect Wallet
            </WalletMultiButton>
          </div>
        </div>
      </nav>
    </>
  );
}
