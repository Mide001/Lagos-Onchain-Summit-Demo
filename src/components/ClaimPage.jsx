import React, { useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { QrCode, Coins, ArrowRight, Loader2, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QRCodeABI from "../constants";


const ClaimPage = ({ code }) => {
  const [transactionHash, setTransactionHash] = useState(null);
  const { error, isPending, writeContract } = useWriteContract();
  const { isConnected } = useAccount();
  const contractAddress = "0x916C587f835708531621bD4FB42d25a3518370e2";

  const checkAndClaim = async (e) => {
    e.preventDefault();
    try {
      const txHash = await writeContract({
        address: contractAddress,
        abi: QRCodeABI,
        functionName: "claimUSDC",
        args: [code],
      });

      if (txHash) {
        setTransactionHash(txHash);
      } else {
        setTransactionHash(null);
      }
    } catch (error) {
      console.error(error);
      setTransactionHash(null);
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: transactionHash,
  });

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="flex flex-col items-center text-center space-y-6">

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-900">Lagos Onchain Summit</h1>
          <p className="text-gray-600">Scan, Claim & Win USDC Campaign</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-full">
          <QrCode size={64} className="text-blue-600" />
        </div>

        <div className="bg-gray-50 px-4 py-2 rounded-lg">
          <p className="font-mono text-gray-700">Code: {code}</p>
        </div>

        <div className="flex items-center space-x-2 text-green-600">
          <Coins size={24} />
          <span className="text-xl font-semibold">1 USDC</span>
        </div>

        <form onSubmit={checkAndClaim} className="w-full">
          <button
            disabled={isPending || !isConnected}
            type="submit"
            className={`w-full font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 
            ${!isConnected 
              ? 'bg-gray-400 cursor-not-allowed opacity-50' 
              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'}`}
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Processing...</span>
              </>
            ) : !isConnected ? (
              <>
                <Wallet size={20} />
                <span>Connect Wallet to Claim</span>
              </>
            ) : (
              <>
                <span>Claim USDC</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {!isConnected && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTitle className="flex items-center gap-2">
              <Wallet size={16} />
              Wallet Connection Required
            </AlertTitle>
            <AlertDescription>
              Please connect your wallet to claim your USDC reward.
            </AlertDescription>
          </Alert>
        )}

        {transactionHash && (
          <div>Transaction Hash: {transactionHash}</div>
        )}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div className="text-red-500">Error: {error.message}</div>
        )}

        <div className="border-t pt-6 mt-6 text-sm text-gray-600">
          <h3 className="font-semibold mb-2">How it works:</h3>
          <ol className="text-left space-y-2">
            <li>1. Scan the QR code at the summit</li>
            <li>2. Connect your wallet</li>
            <li>3. Claim your USDC reward</li>
            <li>4. Share with friends to earn more!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;