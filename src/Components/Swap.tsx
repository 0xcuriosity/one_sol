import { useRef, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { ArrowUpDown, RefreshCw } from "lucide-react";

const SwapComponent = () => {
  const fromAmountRef = useRef<HTMLInputElement>(null);
  const toAmountRef = useRef<HTMLInputElement>(null);
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  // Mock token list - you can expand this
  const tokens = [
    {
      symbol: "SOL",
      name: "Solana",
      mint: "So11111111111111111111111111111111111111112",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    },
    {
      symbol: "USDT",
      name: "Tether",
      mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    },
    {
      symbol: "RAY",
      name: "Raydium",
      mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    },
    {
      symbol: "BONK",
      name: "Bonk",
      mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    },
    {
      symbol: "JUP",
      name: "Jupiter",
      mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    },
  ];

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const swapTokenPositions = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);

    // Also swap amounts if they exist
    const fromAmount = fromAmountRef.current?.value;
    const toAmount = toAmountRef.current?.value;

    if (fromAmountRef.current) fromAmountRef.current.value = toAmount || "";
    if (toAmountRef.current) toAmountRef.current.value = fromAmount || "";
  };

  const getQuote = async () => {
    const amount = fromAmountRef.current?.value;

    if (!amount || Number(amount) <= 0) {
      showNotification("Please enter an amount to get a quote", "error");
      return;
    }

    if (fromToken === toToken) {
      showNotification("Please select different tokens to swap", "error");
      return;
    }

    setIsLoadingQuote(true);

    // Mock quote functionality - replace with Jupiter API later
    setTimeout(() => {
      const mockRate = Math.random() * 100 + 1;
      const estimatedOutput = (Number(amount) * mockRate).toFixed(6);

      if (toAmountRef.current) {
        toAmountRef.current.value = estimatedOutput;
      }

      setIsLoadingQuote(false);
      showNotification(
        `Quote updated: ${amount} ${fromToken} ≈ ${estimatedOutput} ${toToken}`,
        "success"
      );
    }, 1500);
  };

  const executeSwap = async () => {
    const fromAmount = fromAmountRef.current?.value;
    const toAmount = toAmountRef.current?.value;

    if (!wallet.connected) {
      showNotification("Please connect your wallet first", "error");
      return;
    }

    if (!fromAmount || Number(fromAmount) <= 0) {
      showNotification("Please enter a valid amount to swap", "error");
      return;
    }

    if (!toAmount) {
      showNotification("Please get a quote first", "error");
      return;
    }

    if (fromToken === toToken) {
      showNotification("Please select different tokens to swap", "error");
      return;
    }

    setIsLoading(true);

    // Mock swap execution - replace with Jupiter API later
    setTimeout(() => {
      setIsLoading(false);
      showNotification(
        `Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
        "success"
      );

      // Clear form
      if (fromAmountRef.current) fromAmountRef.current.value = "";
      if (toAmountRef.current) toAmountRef.current.value = "";
    }, 2000);
  };

  return (
    <div className="bg-black flex items-center justify-center p-4 mb-96">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ${
              notification.type === "error"
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}
          >
            {notification.message}
          </div>
        </div>
      )}

      <div className="bg-gray-100 border border-gray-800 rounded-xl p-8 shadow-2xl max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-black text-2xl font-bold mb-2">Token Swap</h2>
          <p className="text-gray-500 text-sm">
            Swap tokens using Jupiter aggregator
          </p>
        </div>

        <div className="space-y-2">
          {/* From Token Section */}
          <label className="block text-black text-sm font-medium">From</label>
          <div className="flex gap-3">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="flex-shrink-0 px-3 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              ref={fromAmountRef}
              placeholder="0.00"
              step="0.000001"
              className="flex-1 px-4 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
            />
          </div>
          <div className="mt-2 text-right">
            <p className="text-gray-500 text-xs">Balance: 0.00 {fromToken}</p>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <button
              onClick={swapTokenPositions}
              className="p-2 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-110"
            >
              <ArrowUpDown size={20} className="text-gray-600" />
            </button>
          </div>

          {/* To Token Section */}
          <label className="block text-black text-sm font-medium ">To</label>
          <div className="flex gap-3">
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="flex-shrink-0 px-3 py-3 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              ref={toAmountRef}
              placeholder="0.00"
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-black placeholder-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="mt-2 text-right">
            <p className="text-gray-500 text-xs mb-6">
              Balance: 0.00 {toToken}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={getQuote}
              disabled={isLoadingQuote}
              className={`w-full font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                isLoadingQuote
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              <RefreshCw
                size={20}
                className={isLoadingQuote ? "animate-spin" : ""}
              />
              {isLoadingQuote ? "Getting Quote..." : "Get Quote"}
            </button>

            <button
              onClick={executeSwap}
              disabled={!wallet.connected || isLoading}
              className={`w-full font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                !wallet.connected || isLoading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-600"
              }`}
            >
              <ArrowUpDown size={20} />
              {isLoading ? "Swapping..." : "Swap"}
            </button>
          </div>

          {/* Swap Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="text-black font-medium">
                  1 {fromToken} ≈ -- {toToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price Impact:</span>
                <span className="text-black font-medium">0.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minimum Received:</span>
                <span className="text-black font-medium">-- {toToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network Fee:</span>
                <span className="text-black font-medium">~0.000005 SOL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-xs">
              {!wallet.connected
                ? "Please connect your wallet to swap tokens"
                : "Powered by Jupiter aggregator for best rates"}
            </p>
            {wallet.connected && (
              <p className="text-gray-400 text-xs">
                Connected: {wallet.publicKey?.toBase58().slice(0, 8)}...
                {wallet.publicKey?.toBase58().slice(-8)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapComponent;
