import { useState, useRef } from "react";
import { Coins, ArrowRightLeft, Send } from "lucide-react";

const LiquidStakingComponent = () => {
  const [activeTab, setActiveTab] = useState("stake");
  const stakeAmountRef = useRef<HTMLInputElement>(null);
  const migrateAmountRef = useRef<HTMLInputElement>(null);

  const handleStake = () => {
    const amount = Number(stakeAmountRef?.current?.value);
    console.log("Staking:", amount, "SOL");
    // TODO: Add staking logic here
  };

  const handleMigrate = () => {
    const amount = Number(migrateAmountRef?.current?.value);
    console.log("Migrating:", amount, "LST tokens");
    // TODO: Add migration logic here
  };

  return (
    <div className="bg-black flex items-center justify-center p-4 min-h-screen">
      <div className="bg-gray-100 border border-gray-800 rounded-xl p-8 shadow-2xl max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-black text-2xl font-bold mb-2">Liquid Staking</h2>
          <p className="text-gray-500 text-sm">
            Stake SOL and receive liquid staking tokens
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab("stake")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === "stake"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <Coins size={16} />
            Stake SOL
          </button>
          <button
            onClick={() => setActiveTab("migrate")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === "migrate"
                ? "bg-black text-white shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <ArrowRightLeft size={16} />
            Migrate Stake
          </button>
        </div>

        {/* Stake Tab Content */}
        {activeTab === "stake" && (
          <div className="space-y-6">
            <div>
              <label className="block text-black text-sm font-medium mb-2">
                Amount to Stake (SOL)
              </label>
              <input
                type="number"
                ref={stakeAmountRef}
                placeholder="Enter SOL amount..."
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
              />
            </div>

            <div className="bg-gray-200 border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">You will receive:</span>
                <span className="text-black font-medium">~0.00 LST</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-600">Exchange rate:</span>
                <span className="text-black font-medium">1 SOL = 1.05 LST</span>
              </div>
            </div>

            <button
              onClick={handleStake}
              className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-all duration-200"
            >
              <Coins size={20} />
              Stake SOL
            </button>
          </div>
        )}

        {/* Migrate Tab Content */}
        {activeTab === "migrate" && (
          <div className="space-y-6">
            <div>
              <label className="block text-black text-sm font-medium mb-2">
                Amount to Migrate (LST)
              </label>
              <input
                type="number"
                ref={migrateAmountRef}
                placeholder="Enter LST amount..."
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
              />
            </div>

            <div className="bg-gray-200 border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">You will receive:</span>
                <span className="text-black font-medium">~0.00 SOL</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-600">Exchange rate:</span>
                <span className="text-black font-medium">1 LST = 0.95 SOL</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-600">Available LST:</span>
                <span className="text-black font-medium">0.00 LST</span>
              </div>
            </div>

            <button
              onClick={handleMigrate}
              className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-all duration-200"
            >
              <Send size={20} />
              Migrate Stake
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              Liquid staking allows you to earn rewards while maintaining
              liquidity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidStakingComponent;
