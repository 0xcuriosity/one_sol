import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMetadataPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  getMintLen,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { Rocket } from "lucide-react";
import { useRef, useState } from "react";
import NotificationModal from "./NotificationModal";
import {
  createInitializeInstruction,
  pack,
  type TokenMetadata,
} from "@solana/spl-token-metadata";
const basicInfoInputBoxStyles =
  "w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors duration-200";

// TODO - validate the public keys provided by the user as mintAuthority and freezeAuthority

const TokenLaunchpad = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [mintAccountAddress, setMintAccountAddress] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const wallet = useWallet();
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const tokenNameRef = useRef<HTMLInputElement>(null);
  const tokenSymbolRef = useRef<HTMLInputElement>(null);
  const tokenImageUrlRef = useRef<HTMLInputElement>(null);
  const tokenDecimalsRef = useRef<HTMLInputElement>(null);
  const mintAuthorityRef = useRef<HTMLInputElement>(null);
  const freezeAuthorityRef = useRef<HTMLInputElement>(null);
  const freezeAuthorityEnabledRef = useRef<HTMLInputElement>(null);

  const handleMintToken = async () => {
    if (!wallet.publicKey) {
      throw new Error("Connect wallet to get started");
    }
    const decimals = tokenDecimalsRef.current?.value
      ? Number(tokenDecimalsRef.current.value)
      : 9;
    const mintAuthority = mintAuthorityRef.current?.value
      ? new PublicKey(mintAuthorityRef.current.value)
      : wallet.publicKey;
    const freezeAuthorityEnabled =
      freezeAuthorityEnabledRef.current?.checked || false;
    const freezeAuthority = freezeAuthorityEnabled
      ? freezeAuthorityRef.current?.value
        ? new PublicKey(freezeAuthorityRef.current.value)
        : wallet.publicKey
      : null;
    const mint = Keypair.generate();
    const metadata: TokenMetadata = {
      mint: mint.publicKey,
      name: tokenNameRef.current?.value || "Token1",
      symbol: tokenSymbolRef.current?.value || "TK",
      uri: tokenImageUrlRef.current?.value || "",
      additionalMetadata: [],
    };
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      space: mintLen,
      lamports: lamports,
      programId: TOKEN_2022_PROGRAM_ID,
    });
    const initializeMetadataPointerInstruction =
      createInitializeMetadataPointerInstruction(
        mint.publicKey,
        wallet.publicKey,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID
      );
    // initialize a token
    const initializeMintInstruction = createInitializeMintInstruction(
      mint.publicKey,
      decimals,
      mintAuthority,
      freezeAuthority,
      TOKEN_2022_PROGRAM_ID
    );
    // attach metadata
    const initializeInstruction = createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mint.publicKey,
      metadata: mint.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: mintAuthority,
      updateAuthority: mintAuthority,
    });
    const transaction = new Transaction().add(
      createAccountInstruction,
      initializeMetadataPointerInstruction,
      initializeMintInstruction,
      initializeInstruction
    );
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(mint);
    try {
      const transactionSignature = await wallet.sendTransaction(
        transaction,
        connection
      );
      await connection.confirmTransaction(transactionSignature, "confirmed");
      setMintAccountAddress(mint.publicKey.toBase58());
      setTxSignature(transactionSignature);
      setNotificationVisible(true);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  };

  // const recentBlockhash = await connection.getLatestBlockhash();
  return (
    <>
      <NotificationModal
        mintAccountAddress={mintAccountAddress}
        transactionSignature={txSignature}
        isVisible={notificationVisible}
        setIsVisible={setNotificationVisible}
      />
      <div className="bg-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 border border-gray-200 rounded-xl shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-gray-300">
              <div className="text-center">
                <h1 className="text-black text-2xl font-bold  flex items-center justify-center gap-2">
                  <Rocket className="text-blue-700" size={36} />
                  Token Launchpad
                </h1>
                <p className="text-gray-400">
                  Create and deploy your custom SPL token
                </p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Basic Information */}
              <section>
                <h2 className="text-black text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black text-sm font-medium mb-2">
                      Token Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., My Awesome Token"
                      className={basicInfoInputBoxStyles}
                      ref={tokenNameRef}
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-medium mb-2">
                      Symbol
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., MAT"
                      className={basicInfoInputBoxStyles}
                      ref={tokenSymbolRef}
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-medium mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/token-image.png"
                      className={basicInfoInputBoxStyles}
                      ref={tokenImageUrlRef}
                    />
                  </div>

                  <div>
                    <label className="block text-black text-sm font-medium mb-2">
                      Decimals
                    </label>
                    <input
                      type="number"
                      placeholder="9"
                      min="0"
                      max="18"
                      className={basicInfoInputBoxStyles}
                      ref={tokenDecimalsRef}
                    />
                  </div>
                </div>
              </section>

              {/* Supply & Authority */}
              <section>
                <h2 className="text-black text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
                  Authority
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black text-sm font-medium mb-2">
                      Mint Authority
                    </label>
                    <input
                      type="text"
                      placeholder="Wallet address (leave empty to disable)"
                      className={basicInfoInputBoxStyles}
                      ref={mintAuthorityRef}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-black text-sm font-medium mb-2">
                      Freeze Authority
                    </label>
                    <div className="flex gap-2">
                      <label className="flex items-center space-x-3 bg-gray-200 border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-black transition-colors duration-200">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-black bg-gray-700 border-gray-600 rounded focus:ring-black focus:ring-2"
                          ref={freezeAuthorityEnabledRef}
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Wallet address (leave empty to disable)"
                        className={basicInfoInputBoxStyles}
                        ref={freezeAuthorityRef}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Launch Button */}
              <div className="pt-6 border-t border-gray-300">
                <button
                  className="w-full bg-black text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-600 transition-all duration-200"
                  onClick={handleMintToken}
                >
                  <Rocket size={24} />
                  Launch Token
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenLaunchpad;
/* 


const connection = new Connection("http://localhost:8899", "confirmed");
const recentBlockhash = await connection.getLatestBlockhash();

const feePayer = Keypair.generate();

const airdropSignature = await connection.requestAirdrop(
  feePayer.publicKey,
  LAMPORTS_PER_SOL
);
await connection.confirmTransaction({
  blockhash: recentBlockhash.blockhash,
  lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
  signature: airdropSignature
});

const mint = Keypair.generate();

const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: feePayer.publicKey,
  newAccountPubkey: mint.publicKey,
  space: MINT_SIZE,
  lamports: await getMinimumBalanceForRentExemptMint(connection),
  programId: TOKEN_2022_PROGRAM_ID
});

const initializeMintInstruction = createInitializeMintInstruction(
  mint.publicKey,
  9,
  feePayer.publicKey,
  feePayer.publicKey,
  TOKEN_2022_PROGRAM_ID
);

const transaction = new Transaction().add(
  createAccountInstruction,
  initializeMintInstruction
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [feePayer, mint]
);

console.log("Mint Address: ", mint.publicKey.toBase58());
console.log("Transaction Signature: ", transactionSignature);

*/
