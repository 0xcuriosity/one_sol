import { useRef, useState } from "react";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import bs58 from "bs58";
import {
  Copy,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Plus,
  Check,
} from "lucide-react";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
type Wallet = {
  id: number;
  index: number;
  publicKey: string;
  privateKey: string;
  showPrivateKey: boolean;
};
// TODO - add the passphrase feature - generate the public-private keypair taking the passphrase as the input
const GenerateWallet = () => {
  const [mneumonic, setMneumonic] = useState("");
  const passPhraseRef = useRef<HTMLInputElement>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletCounter, setWalletCounter] = useState(0); // use as current index
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState<number | null>(null);

  // Generate a mock key pair (in real implementation, derive from seed phrase)

  const handleGenerateNewSeed = async () => {
    const mn = generateMnemonic();
    console.log(mn);
    setMneumonic(mn);
    setWallets([]);
    setWalletCounter(0);
    setCopiedSeed(false);
  };

  const handleCreateWallet = async () => {
    if (!mneumonic) {
      const newSeed = generateMnemonic();
      setMneumonic(newSeed);
    }

    const seed = await mnemonicToSeed(mneumonic);
    const path = `m/44'/501'/${walletCounter}'/0'`;
    const seedBuffer = Buffer.from(seed);
    const derivedSeed = derivePath(path, seedBuffer.toString("hex")).key;
    const keypair = nacl.sign.keyPair.fromSeed(derivedSeed);
    const newWallet: Wallet = {
      id: Date.now(),
      index: walletCounter,
      publicKey: bs58.encode(keypair.publicKey),
      privateKey: bs58.encode(keypair.secretKey),
      showPrivateKey: false,
    };

    setWallets((prev) => [...prev, newWallet]);
    setWalletCounter((prev) => prev + 1);
  };

  const handleCopySeed = async () => {
    try {
      await navigator.clipboard.writeText(mneumonic);
      setCopiedSeed(true);
      setTimeout(() => setCopiedSeed(false), 2000);
    } catch (err) {
      console.error("Failed to copy seed phrase:", err);
    }
  };

  const handleCopyPublicKey = async (publicKey: string, walletId: number) => {
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopiedWallet(walletId);
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (err) {
      console.error("Failed to copy public key:", err);
    }
  };

  const togglePrivateKeyVisibility = (walletId: number) => {
    setWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === walletId
          ? { ...wallet, showPrivateKey: !wallet.showPrivateKey }
          : wallet
      )
    );
  };

  const deleteWallet = (walletId: number) => {
    setWallets((prev) => prev.filter((wallet) => wallet.id !== walletId));
  };

  return (
    <div className="bg-black p-6">
      <div className="max-w-4xl mx-auto space-y-6 bg-gray-100 border border-gray-200 rounded-xl">
        {/* Header Card */}
        <div className="bg-gray-100 rounded-xl p-6 text-center ">
          <h1 className="text-black text-2xl font-bold mb-2">
            Generate a wallet from your passphrase
          </h1>
          <p className="text-gray-400 text-sm">
            Create secure wallets using a seed phrase for backup and recovery
          </p>
        </div>

        {/* Seed Phrase Section */}
        {mneumonic && (
          <>
            <div className="bg-gray-100  rounded-xl p-6 ">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-black text-lg font-semibold">
                  Your Seed Phrase
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopySeed}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                  >
                    {copiedSeed ? <Check size={16} /> : <Copy size={16} />}
                    {copiedSeed ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={handleGenerateNewSeed}
                    className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
                  >
                    <RefreshCw size={16} />
                    New Seed
                  </button>
                </div>
              </div>

              <div className="bg-black border border-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {mneumonic.split(" ").map((word, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 text-black text-sm px-3 py-2 rounded text-center font-mono"
                    >
                      <span className="text-gray-500 text-xs">
                        {index + 1}.
                      </span>{" "}
                      {word}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-red-900/20 border border-yellow-700 rounded-lg">
                <p className="text-black text-xs">
                  ⚠️ Keep your seed phrase secure and never share it with
                  anyone. Anyone with access to your seed phrase can control
                  your wallets.
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-black text-md font-medium mt-6 mb-2">
                  Secret Passphrase (optional)
                </label>
                <input
                  type="text"
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors duration-200"
                  ref={passPhraseRef}
                />
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCreateWallet}
                  className="bg-black text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-all duration-200  shadow-lg max-w-4xl w-full justify-center"
                >
                  <Plus size={20} />
                  Create Wallet
                </button>
              </div>
            </div>
            {/* Controls */}
          </>
        )}

        {!mneumonic && (
          <div className="w-full px-8">
            <button
              onClick={handleGenerateNewSeed}
              className="bg-black  hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 w-full justify-center"
            >
              <RefreshCw size={20} />
              Generate Seed Phrase
            </button>
          </div>
        )}

        {/* Wallets List */}
        {wallets.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-black text-xl font-semibold text-center">
              Generated Wallets ({wallets.length})
            </h2>

            {wallets.map((wallet) => (
              <div className="p-6">
                <div
                  key={wallet.id}
                  className="bg-slate-800 border border-gray-200 rounded-xl p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">
                      Wallet {wallet.index + 1}
                    </h3>
                    <button
                      onClick={() => deleteWallet(wallet.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-black p-2 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* Public Key */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Public Key
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-4 py-2">
                          <code className="text-black text-xs break-all font-mono">
                            {wallet.publicKey}
                          </code>
                        </div>
                        <button
                          onClick={() =>
                            handleCopyPublicKey(
                              wallet.publicKey.toString(),
                              wallet.id
                            )
                          }
                          className="bg-gray-300 hover:bg-gray-400 text-black p-3 rounded-lg transition-colors duration-200"
                        >
                          {copiedWallet === wallet.id ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Private Key */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Private Key
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 border border-gray-300 rounded-lg px-4 py-2">
                          <code className="text-black text-xs break-all font-mono">
                            {wallet.showPrivateKey
                              ? wallet.privateKey
                              : "•".repeat(64)}
                          </code>
                        </div>
                        <button
                          onClick={() => togglePrivateKeyVisibility(wallet.id)}
                          className="bg-gray-300 hover:bg-gray-400 text-black p-3 rounded-lg transition-colors duration-200"
                        >
                          {wallet.showPrivateKey ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {wallets.length === 0 && !mneumonic && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No wallets generated yet
            </p>
            <p className="text-gray-600 text-sm">
              Click "Generate Seed Phrase" to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateWallet;
