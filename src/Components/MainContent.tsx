import AirdropComponent from "./Airdrop";
import Navbar from "./NavigationBar";
import { Sidebar } from "./Sidebar";
import TokenLaunchpad from "./TokenLaunchpad";
import GenerateWallet from "./WalletGenerator";
import TokenManager from "./ManageTokens";
import { ActiveTabContext } from "../App";
import { useContext, useRef, useEffect } from "react";
import SendSOLComponent from "./SendSOL";
import SwapComponent from "./Swap";
import LiquidStakingComponent from "./LST";
export default function MainContent() {
  const { activeTab } = useContext(ActiveTabContext);
  const walletRef = useRef<HTMLDivElement>(null);
  const airdropRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);
  const tokenManagerRef = useRef<HTMLDivElement>(null);
  const transferRef = useRef<HTMLDivElement>(null);
  const swapRef = useRef<HTMLDivElement>(null);
  const stakeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      generate: walletRef,
      airdrop: airdropRef,
      token: tokenRef,
      manage: tokenManagerRef,
      transfer: transferRef,
      swap: swapRef,
      stake: stakeRef,
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
        <div ref={tokenManagerRef}>
          <TokenManager />
        </div>
        <div ref={transferRef}>
          <SendSOLComponent />
        </div>
        <div ref={swapRef}>
          <SwapComponent />
        </div>
        <div ref={stakeRef}>
          <LiquidStakingComponent />
        </div>
      </div>
    </div>
  );
}
