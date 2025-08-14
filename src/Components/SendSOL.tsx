import { useRef, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Send, Heart } from "lucide-react";
import {
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};
const SendSOLComponent = () => {
  const addressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  const TIP_ADDRESS = "qDVxcGRzmr9TWkAVmHtE89JeZuqmnqHZ6N5qqMtDfot";

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const populateTipAddress = () => {
    if (addressRef.current) {
      addressRef.current.value = TIP_ADDRESS;
    }
  };

  const sendSOL = async () => {
    const address = addressRef.current?.value?.trim();
    const amount = Number(amountRef.current?.value);

    // Validation
    if (!wallet.publicKey) {
      showNotification("Please connect your wallet first", "error");
      return;
    }

    if (!address) {
      showNotification("Please enter a recipient address", "error");
      return;
    }

    if (!isValidSolanaAddress(address)) {
      showNotification("Please enter a valid Solana address", "error");
      return;
    }

    if (!amount || amount <= 0) {
      showNotification("Please enter a valid amount greater than 0", "error");
      return;
    }

    if (amount > 10) {
      showNotification("Amount limited to 10 SOL for safety", "error");
      return;
    }

    setIsLoading(true);

    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(address),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await wallet.sendTransaction(transaction, connection);

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");

      showNotification(
        `Successfully sent ${amount} SOL to ${address.slice(
          0,
          6
        )}...${address.slice(-4)}`,
        "success"
      );

      // Clear form
      if (addressRef.current) addressRef.current.value = "";
      if (amountRef.current) amountRef.current.value = "";
    } catch (error) {
      console.error("Transaction failed:", error);
      showNotification(
        "Transaction failed. Please check your balance and try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black  flex items-center justify-center p-4">
      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
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
          <h2 className="text-black text-2xl font-bold mb-2">Send SOL</h2>
          <p className="text-gray-500 text-sm">
            Transfer SOL tokens to another wallet
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              ref={addressRef}
              placeholder="Enter Solana wallet address..."
              className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Amount (SOL)
            </label>
            <input
              type="number"
              ref={amountRef}
              placeholder="Enter amount..."
              max="10"
              step="0.001"
              className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
            />
            <p className="text-gray-400 text-xs mt-1">
              Maximum 10 SOL per transaction
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <button
                onClick={sendSOL}
                disabled={!wallet.connected || isLoading}
                className={`w-full font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  !wallet.connected || isLoading
                    ? "bg-gray-300 text-black cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-600"
                }`}
              >
                <Send size={20} />
                {isLoading ? "Sending..." : "Send SOL"}
              </button>

              {/* Tooltip - only when wallet not connected */}
              {!wallet.connected && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Please connect your wallet
                </span>
              )}
            </div>

            <button
              onClick={populateTipAddress}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:from-pink-700 hover:to-purple-800 transition-all duration-200"
            >
              <Heart size={20} />
              Tip Me
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-xs">
              {!wallet.connected
                ? "Please connect your wallet to send SOL"
                : "Double-check the recipient address before sending"}
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

export default SendSOLComponent;
