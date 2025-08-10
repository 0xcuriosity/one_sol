import AirdropComponent from "./Airdrop";
import Navbar from "./NavigationBar";
import { Sidebar } from "./Sidebar";
import TokenLaunchpad from "./TokenLaunchpad";
import GenerateWallet from "./WalletGenerator";
import { ActiveTabContext } from "../App";
import { useContext, useRef, useEffect } from "react";
export default function MainContent() {
  const { activeTab } = useContext(ActiveTabContext);
  const walletRef = useRef<HTMLDivElement>(null);
  const airdropRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      generate: walletRef,
      airdrop: airdropRef,
      token: tokenRef,
    };

    const targetRef = sectionMap[activeTab];
    if (targetRef?.current) {
      const top =
        targetRef.current.getBoundingClientRect().top + window.scrollY;
      const offset = 110;
      window.scrollTo({
        top: top - offset,
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  return (
    <div className="ml-56 mt-40">
      <Navbar />
      <Sidebar />

      <div className="flex flex-col gap-96">
        <div ref={walletRef}>
          <GenerateWallet />
        </div>

        <div ref={airdropRef}>
          <AirdropComponent />
        </div>

        <div ref={tokenRef}>
          <TokenLaunchpad />
        </div>
      </div>
    </div>
  );
}
