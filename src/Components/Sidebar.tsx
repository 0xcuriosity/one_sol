import { useContext } from "react";
import { Send, Rocket, Wallet, ArrowLeftRight, Bitcoin } from "lucide-react";
import { SidebarItem } from "./SideBarItem";
import SolanaLogo from "../Icons/SolanaLogo";
import { ActiveTabContext } from "../App";
export const Sidebar = () => {
  const { activeTab, setActiveTab } = useContext(ActiveTabContext);
  const menuItems = [
    { id: "generate", icon: <Wallet size={20} />, text: "Generate Wallet" },
    { id: "airdrop", icon: <Send size={20} />, text: "Airdrop" },
    { id: "token", icon: <Rocket size={20} />, text: "Launch token" },
    { id: "manage", icon: <Bitcoin size={20} />, text: "Manage Tokens" },
    { id: "transfer", icon: <ArrowLeftRight size={20} />, text: "Transfers" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black shadow-2xl border-r border-gray-800 z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-2 px-6 py-8">
          <SolanaLogo />
          <div className=" text-3xl font-bold bg-gradient-to-r from-gray-600 to-white bg-clip-text text-transparent">
            OneSol
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              startIcon={item.icon}
              text={item.text}
              isActive={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};
