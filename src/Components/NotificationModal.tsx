import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
type CopiedFieldType = "mint" | "signature" | null;
export default function NotificationModal({
  mintAccountAddress,
  transactionSignature,
  isVisible,
  setIsVisible,
}: {
  mintAccountAddress: string;
  transactionSignature: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [copiedField, setCopiedField] = useState<CopiedFieldType>(null);

  const copyToClipboard = async (text: string, field: CopiedFieldType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-96 max-w-sm">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-black font-semibold text-sm">
            Transaction Details
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mint Authority Box */}
        <div className="mb-3">
          <label className="block text-black text-xs font-medium mb-1">
            Mint Authority
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-3 py-2">
            <input
              type="text"
              value={mintAccountAddress}
              readOnly
              className="flex-1 bg-transparent text-black text-xs font-mono outline-none"
            />
            <button
              onClick={() => copyToClipboard(mintAccountAddress, "mint")}
              className="ml-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Copy to clipboard"
            >
              {copiedField === "mint" ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Transaction Signature Box */}
        <div>
          <label className="block text-black text-xs font-medium mb-1">
            Transaction Signature
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-3 py-2">
            <input
              type="text"
              value={transactionSignature}
              readOnly
              className="flex-1 bg-transparent text-black text-xs font-mono outline-none"
            />
            <button
              onClick={() => copyToClipboard(transactionSignature, "signature")}
              className="ml-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Copy to clipboard"
            >
              {copiedField === "signature" ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
