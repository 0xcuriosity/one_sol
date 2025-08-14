import { useEffect, useRef, useState } from "react";
import { Coins, Send, Flame, Layers, Plus, Wallet } from "lucide-react";
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createTransferCheckedInstruction,
  createBurnCheckedInstruction,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { isValidSolanaAddress } from "./SendSOL";
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
  const mintAddressRef = useRef<HTMLInputElement>(null);
  const selectMintRef = useRef<HTMLSelectElement>(null);
  const mintAmountRef = useRef<HTMLInputElement>(null);
  const transferAddressRef = useRef<HTMLInputElement>(null);
  const transferAmountRef = useRef<HTMLInputElement>(null);
  const burnAmount = useRef<HTMLInputElement>(null);
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
    }, 10000);
  };

  const handleMint = async () => {
    if (
      !mintAddressRef.current?.value ||
      !wallet.publicKey ||
      !mintAmountRef.current?.value
    ) {
      return;
    }
    const mintPublickey = new PublicKey(mintAddressRef.current?.value);
    const associatedTokenAddress = getAssociatedTokenAddressSync(
      mintPublickey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    console.log(associatedTokenAddress);
    const createAtaInstruction = createAssociatedTokenAccountInstruction(
      wallet.publicKey, // payer
      associatedTokenAddress, // ata
      wallet.publicKey, // owner
      mintPublickey, // mint
      TOKEN_2022_PROGRAM_ID
    );
    console.log(createAtaInstruction);
    const createMintInstruction = createMintToInstruction(
      mintPublickey,
      associatedTokenAddress,
      wallet.publicKey,
      Number(mintAmountRef.current.value) * LAMPORTS_PER_SOL, // 1 billion tokens (with 9 decimals = 1 token)
      [],
      TOKEN_2022_PROGRAM_ID
    );
    const transaction = new Transaction().add(
      createAtaInstruction,
      createMintInstruction
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    try {
      const txSignature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(txSignature, "confirmed");
      addNotification(
        `Transaction successfull , transaction Id : ${txSignature}`
      );
    } catch (error) {
      console.log(error);
      addNotification(`Transaction failed`, "error");
    }
  };

  const handleTransfer = async () => {
    const address = transferAddressRef.current?.value?.trim();
    const amount = Number(transferAmountRef.current?.value);
    const token = selectMintRef.current?.value;
    console.log(`transferring token : ${token}`);
    const tokenMintAddress = token_2022_Tokens.find((x) => x.mint === token);
    const decimals = tokenMintAddress?.decimals;
    console.log(decimals);
    if (!token || !decimals) {
      return;
    }

    const mintPublickey = new PublicKey(token);
    // Validation
    if (!wallet.publicKey) {
      addNotification("Please connect your wallet first", "error");
      return;
    }

    if (!address) {
      addNotification("Please enter a recipient address", "error");
      return;
    }

    if (!isValidSolanaAddress(address)) {
      addNotification("Please enter a valid Solana address", "error");
      return;
    }

    if (!amount || amount <= 0) {
      addNotification("Please enter a valid amount greater than 0", "error");
      return;
    }

    // TODO - logic to actually create ATA for recipient Solana address and send the token

    const fromWalletPublicKey = wallet.publicKey;
    const toWallet = new PublicKey(address);
    const fromTokenAccountAddress = await getAssociatedTokenAddressSync(
      mintPublickey,
      fromWalletPublicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    const toTokenAccountAddress = await getAssociatedTokenAddressSync(
      mintPublickey,
      toWallet,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    // const createFromAtaIx = createAssociatedTokenAccountInstruction(
    //   fromWalletPublicKey, // payer
    //   fromTokenAccountAddress, // ata
    //   fromWalletPublicKey, // owner
    //   mintPublickey,
    //   TOKEN_2022_PROGRAM_ID
    // );

    const createToAtaIx = createAssociatedTokenAccountInstruction(
      fromWalletPublicKey, // payer
      toTokenAccountAddress, // ata
      toWallet, // owner
      mintPublickey,
      TOKEN_2022_PROGRAM_ID
    );
    const transferAmount = amount * 10 ** decimals;
    const transferIx = createTransferCheckedInstruction(
      fromTokenAccountAddress, // from
      mintPublickey, // mint
      toTokenAccountAddress, // to
      fromWalletPublicKey, // from's owner
      transferAmount,
      decimals,
      [],
      TOKEN_2022_PROGRAM_ID
    );
    try {
      const createToAtaTransaction = new Transaction().add(createToAtaIx);
      const tx1Signature = await wallet.sendTransaction(
        createToAtaTransaction,
        connection
      );
      await connection.confirmTransaction(tx1Signature);
      const setupTransaction = new Transaction().add(transferIx);
      const txSignature = await wallet.sendTransaction(
        setupTransaction,
        connection
      );
      await connection.confirmTransaction(txSignature);
      addNotification(
        `Successfully sent ${amount} Tokens (mint address ${mintPublickey} to wallet address ${address})`,
        "success"
      );
      if (transferAddressRef.current) transferAddressRef.current.value = "";
      if (transferAmountRef.current) transferAmountRef.current.value = "";
      if (selectMintRef.current) selectMintRef.current.value = "";
    } catch (error) {
      addNotification(`Transaction failed`, "error");
      console.log(error);
    }
  };

  const handleBurn = async () => {
    if (
      !selectMintRef.current?.value ||
      !burnAmount.current?.value ||
      !wallet.publicKey
    )
      return;
    const amount = burnAmount.current?.value;
    const token = selectMintRef.current?.value;
    const mintPublickey = new PublicKey(token);
    const tokenMintAddress = token_2022_Tokens.find((x) => x.mint === token);
    const decimals = tokenMintAddress?.decimals;
    console.log(decimals);
    if (!decimals) return;
    const associatedTokenAddress = getAssociatedTokenAddressSync(
      mintPublickey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    try {
      const burnTx = createBurnCheckedInstruction(
        associatedTokenAddress,
        mintPublickey,
        wallet.publicKey,
        Number(amount),
        decimals,
        [],
        TOKEN_2022_PROGRAM_ID
      );
      const transaction = new Transaction().add(burnTx);
      const txSignature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(txSignature);
      console.log(txSignature);
      addNotification(
        `Amount ${amount} of Token : ${token} burnt successfully , transaction Signature : ${txSignature}`,
        "success"
      );
    } catch (error) {
      console.log(error);
      addNotification(`Burn Transaction failed`, "error");
    }
  };

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
                    ref={mintAddressRef}
                    placeholder="Enter token mint address"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Amount to Mint
                  </label>
                  <input
                    type="number"
                    ref={mintAmountRef}
                    placeholder="Enter amount"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                    ref={selectMintRef}
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
                    ref={transferAddressRef}
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
                    ref={transferAmountRef}
                    placeholder="Enter amount"
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
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
                    ref={selectMintRef}
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
                    placeholder="Enter amount"
                    ref={burnAmount}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-400 focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
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
