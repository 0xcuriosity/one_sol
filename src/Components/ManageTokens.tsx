import { useEffect, useState } from "react";
import { Coins, Send, Flame, Layers, Plus, Wallet } from "lucide-react";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
interface Token {
  ata: string;
  mint: string;
  owner: string;
  decimals: number;
  amount: number;
}
interface Notification {
  id: number;
  message: string;
  type: "success" | "error";
}
const TokenManager = () => {
  const [activeTab, setActiveTab] = useState("mint");
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [tokenProgramTokens, setTokenProgramTokens] = useState<Token[]>([]);
  const [token_2022_Tokens, setToken_2022_Tokens] = useState<Token[]>([]);
  const { connection } = useConnection();
  const wallet = useWallet();
  async function getTokensByOnwner() {
    if (!wallet.publicKey) {
      return;
    }
    let response1 = await connection.getParsedTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
    const tokens1 = response1.value.map((token) => {
      return {
        ata: token.pubkey.toBase58(),
        mint: token.account.data["parsed"]["info"]["mint"],
        owner: token.account.data["parsed"]["info"]["owner"],
        decimals:
          token.account.data["parsed"]["info"]["tokenAmount"]["decimals"],
        amount: token.account.data["parsed"]["info"]["tokenAmount"]["amount"],
      };
    });
    setTokenProgramTokens(tokens1);
    let response2 = await connection.getParsedTokenAccountsByOwner(
      wallet.publicKey,
      {
        programId: TOKEN_2022_PROGRAM_ID,
      }
    );
    const tokens2 = response2.value.map((token) => {
      return {
        ata: token.pubkey.toBase58(),
        mint: token.account.data["parsed"]["info"]["mint"],
        owner: token.account.data["parsed"]["info"]["owner"],
        decimals:
          token.account.data["parsed"]["info"]["tokenAmount"]["decimals"],
        amount: token.account.data["parsed"]["info"]["tokenAmount"]["amount"],
      };
    });
    setToken_2022_Tokens(tokens2);
  }
  useEffect(() => {
    getTokensByOnwner();
  }, [wallet]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleMint = () => {};

  const handleTransfer = () => {};

  const handleBurn = () => {};

  const tabs = [
    { id: "mint", label: "Mint", icon: Plus },
    { id: "transfer", label: "Transfer", icon: Send },
    { id: "burn", label: "Burn", icon: Flame },
    { id: "view", label: "My Tokens", icon: Layers },
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
                <Send className="w-6 h-6 text-blue-600" />
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
                    {tokenProgramTokens.map((token) => (
                      <option key={token.mint} value={token.mint}>
                        {token.mint} - {token.amount}
                      </option>
                    ))}
                    {token_2022_Tokens.map((token) => (
                      <option key={token.mint} value={token.mint}>
                        {token.mint} - {token.amount}
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
                <Flame className="w-6 h-6 text-red-600" />
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
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
                  >
                    <option value="">Select token</option>
                    {tokenProgramTokens.map((token) => (
                      <option key={token.mint} value={token.mint}>
                        {token.mint} - {token.amount}
                      </option>
                    ))}
                    {token_2022_Tokens.map((token) => (
                      <option key={token.mint} value={token.mint}>
                        {token.mint} - {token.amount}
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
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
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
                <Layers className="w-6 h-6 text-indigo-800" />
                My Tokens
              </h2>
              <div className="grid gap-4">
                {tokenProgramTokens.map((token) => (
                  <div
                    key={token.mint}
                    className="bg-gray-200 border border-gray-300 rounded-lg p-6 hover:bg-gray-750 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Coins className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-black">
                            Token
                          </h3>
                          <p className="text-gray-800 text-sm font-mono">
                            {token.mint}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-black">
                          {token.amount}
                        </p>
                        <p className="text-gray-800 text-sm">
                          {token.decimals} decimals
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {token_2022_Tokens.map((token) => (
                  <div
                    key={token.mint}
                    className="bg-gray-200 border border-gray-300 rounded-lg p-6 hover:bg-gray-750 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Coins className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-black">
                            Token
                          </h3>
                          <p className="text-gray-800 text-sm font-mono">
                            {token.mint}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-black">
                          {token.amount}
                        </p>
                        <p className="text-gray-800 text-sm">
                          {token.decimals} decimals
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {tokenProgramTokens.length === 0 &&
                  token_2022_Tokens.length === 0 && (
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
