import { useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Send } from "lucide-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const AirdropComponent = () => {
  const amountRef = useRef<HTMLInputElement>(null);
  const wallet = useWallet();
  const { connection } = useConnection();
  async function airdrop() {
    const amount = Number(amountRef.current?.value);
    console.log(wallet.publicKey);
    if (!wallet.publicKey) {
      return;
    }
    await connection.requestAirdrop(
      wallet.publicKey,
      amount * LAMPORTS_PER_SOL
    );
    alert("Airdropped " + amount + " SOL to " + wallet.publicKey.toBase58());
  }

  return (
    <div className=" bg-black flex items-center justify-center p-4">
      <div className="bg-gray-100 border border-gray-800 rounded-xl p-8 shadow-2xl max-w-4xl  w-full">
        <div className="text-center mb-8">
          <h2 className="text-black text-2xl font-bold mb-2">SOL Airdrop</h2>
          <p className="text-gray-500 text-sm">
            Request SOL tokens for testing
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Amount (SOL)
            </label>
            <input
              type="number"
              ref={amountRef}
              placeholder="Enter amount..."
              className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
            />
          </div>

          <button
            onClick={airdrop}
            className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-all duration-200 "
          >
            <Send size={20} />
            Send SOL
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              This is a testnet airdrop for development purposes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirdropComponent;

// TODO - add checks for valid public address
// TODO - add a limit to input number of SOL
// TODO - on successfull airdrop / error, instead of alert, show a notification for 3 seconds
// TODO - disable the send button if wallet isnt connected
