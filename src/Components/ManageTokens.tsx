import { useState } from "react";
import { Coins, Send, Flame, Eye, Plus, Wallet } from "lucide-react";

const TokenManager = () => {
  const [activeTab, setActiveTab] = useState("mint");
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [tokens, setTokens] = useState([
    {
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      symbol: "USDC",
      balance: 1000.5,
      decimals: 6,
    },
    {
      mint: "So11111111111111111111111111111111111111112",
      symbol: "SOL",
      balance: 5.25,
      decimals: 9,
    },
  ]);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleMint = () => {
    if (!mintAddress || !mintAmount) {
      addNotification("Please enter both mint address and amount", "error");
      return;
    }

    // Simulate minting
    const newToken = {
      mint: mintAddress,
      symbol: "TOKEN",
      balance: parseFloat(mintAmount),
      decimals: 6,
    };

    const existingToken = tokens.find((t) => t.mint === mintAddress);
    if (existingToken) {
      setTokens((prev) =>
        prev.map((t) =>
          t.mint === mintAddress
            ? { ...t, balance: t.balance + parseFloat(mintAmount) }
            : t
        )
      );
    } else {
      setTokens((prev) => [...prev, newToken]);
    }

    addNotification(`Successfully minted ${mintAmount} tokens!`);
    setMintAmount("");
  };

  const handleTransfer = () => {
    if (!transferAddress || !transferAmount || !mintAddress) {
      addNotification("Please fill in all transfer fields", "error");
      return;
    }

    const token = tokens.find((t) => t.mint === mintAddress);
    if (!token || token.balance < parseFloat(transferAmount)) {
      addNotification("Insufficient balance for transfer", "error");
      return;
    }

    setTokens((prev) =>
      prev.map((t) =>
        t.mint === mintAddress
          ? { ...t, balance: t.balance - parseFloat(transferAmount) }
          : t
      )
    );

    addNotification(
      `Successfully transferred ${transferAmount} tokens to ${transferAddress.slice(
        0,
        6
      )}...${transferAddress.slice(-4)}`
    );
    setTransferAmount("");
    setTransferAddress("");
  };

  const handleBurn = () => {
    if (!burnAmount || !mintAddress) {
      addNotification("Please enter burn amount and select token", "error");
      return;
    }

    const token = tokens.find((t) => t.mint === mintAddress);
    if (!token || token.balance < parseFloat(burnAmount)) {
      addNotification("Insufficient balance for burning", "error");
      return;
    }

    setTokens((prev) =>
      prev.map((t) =>
        t.mint === mintAddress
          ? { ...t, balance: t.balance - parseFloat(burnAmount) }
          : t
      )
    );

    addNotification(`Successfully burned ${burnAmount} tokens!`);
    setBurnAmount("");
  };

  const tabs = [
    { id: "mint", label: "Mint", icon: Plus },
    { id: "transfer", label: "Transfer", icon: Send },
    { id: "burn", label: "Burn", icon: Flame },
    { id: "view", label: "My Tokens", icon: Eye },
  ];

  return (
    <div className="bg-black flex items-center justify-center p-4">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ${
              notification.type === "error"
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto w-full bg-white p-8 rounded-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wallet className="w-8 h-8 text-black" />
            <h1 className="text-4xl font-bold bg-black bg-clip-text text-transparent">
              Token Manager
            </h1>
          </div>
          <p className="text-gray-400">Manage your tokens with ease</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 items-center">
          <div className="bg-gray-100 p-1 rounded-lg border border-gray-300 flex w-full items-center justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-200 w-full justify-center ${
                    activeTab === tab.id
                      ? "bg-black text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white text-black rounded-xl">
          {/* Mint Tab */}
          {activeTab === "mint" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Plus className="w-6 h-6 text-black" />
                Mint Tokens
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Mint Address
                  </label>
                  <input
                    type="text"
                    value={mintAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                    placeholder="Enter token mint address"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Amount to Mint
                  </label>
                  <input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleMint}
                className="w-full bg-black hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Mint Tokens
              </button>
            </div>
          )}

          {/* Transfer Tab */}
          {activeTab === "transfer" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Send className="w-6 h-6 text-blue-400" />
                Transfer Tokens
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Token Mint Address
                  </label>
                  <select
                    value={mintAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-400 focus:border-black-500 focus:ring-2 focus:ring-black/20 transition-all"
                  >
                    <option value="">Select token</option>
                    {tokens.map((token) => (
                      <option key={token.mint} value={token.mint}>
                        {token.symbol} - {token.balance}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    placeholder="Enter wallet address"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-2">
                    Amount to Transfer
                  </label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleTransfer}
                className="w-full bg-black hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 "
              >
                Transfer Tokens
              </button>
            </div>
          )}

          {/* Burn Tab */}
          {activeTab === "burn" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Flame className="w-6 h-6 text-red-400" />
                Burn Tokens
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Token to Burn
                  </label>
                  <select
                    value={mintAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">Select token</option>
                    {tokens.map((token) => (
                      <option key={token.mint} value={token.mint}>
                        {token.symbol} - {token.balance}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Amount to Burn
                  </label>
                  <input
                    type="number"
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleBurn}
                className="w-full bg-black hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Burn Tokens
              </button>
            </div>
          )}

          {/* View Tokens Tab */}
          {activeTab === "view" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-400" />
                My Tokens
              </h2>
              <div className="grid gap-4">
                {tokens.map((token) => (
                  <div
                    key={token.mint}
                    className="bg-gray-800 border border-gray-600 rounded-lg p-6 hover:bg-gray-750 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Coins className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">
                            {token.symbol}
                          </h3>
                          <p className="text-gray-400 text-sm font-mono">
                            {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">
                          {token.balance.toFixed(
                            token.decimals > 2 ? 2 : token.decimals
                          )}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {token.decimals} decimals
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {tokens.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No tokens found</p>
                    <p>Start by minting some tokens!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenManager;
