import { ConnectButton } from "@rainbow-me/rainbowkit";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAccount, useWriteContract } from "wagmi";
import { config } from "@/src/wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import {
  QrCode,
  Coins,
  ArrowRight,
  ThumbsUp,
  Loader2,
  Wallet,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import QRCodeABI from "@/src/constants";
import { useState } from "react";

const Home = () => {
  const router = useRouter();
  const { code } = router.query;
  const [loading, setLoading] = useState(false);
  const { writeContractAsync, error } = useWriteContract();
  const { isConnected } = useAccount();
  const contractAddress = "0x916C587f835708531621bD4FB42d25a3518370e2";

  const [transactionHash, setTransactionHash] = useState("");
  const [status, setStatus] = useState("");

  const checkAndClaim = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tx = await writeContractAsync({
        abi: QRCodeABI,
        address: contractAddress,
        functionName: "claimUSDC",
        args: [code],
      });

      const transactionRecipt = await waitForTransactionReceipt(config, {
        hash: tx,
      });

      setTransactionHash(transactionRecipt.transactionHash);

      if (transactionRecipt.status === "success") {
        setStatus("success");
        setLoading(false);
      } else {
        setStatus("failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Transaction failed to write:", error);
      setLoading(false);
    }
  };

  const getUserErrorMessage = (error) => {
    if (!error) return null;

    console.log("Error: ", error);

    if (error.message.includes("Invalid Code")) {
      return "QR Code has already been claimed.";
    }
    if (error.message.includes("reverted")) {
      return "The transaction failed. Ensure you have sufficient funds and try again.";
    }
    return "An unexpected error occurred. Please try again later.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Head>
        <title>Lagos Onchain Summit</title>
        <meta
          content="QRcode claiming platform for Lagos Onchain Summit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-end">
            <div className="flex items-center">
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-blue-900">
                Lagos Onchain Summit
              </h1>
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
                disabled={loading || !isConnected || status === "success"}
                type="submit"
                className={`w-full font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 
    ${
      !isConnected
        ? "bg-gray-400 cursor-not-allowed opacity-50"
        : status === "success"
        ? "bg-gray-400 cursor-not-allowed opacity-50" 
        : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
    }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="done" size={20} />
                    <span>claiming...</span>
                  </>
                ) : (
                  <>
                    {isConnected ? (
                      <>
                        <span>Claim USDC</span>
                        <ArrowRight size={20} />
                      </>
                    ) : (
                      <>
                        <Wallet size={20} />
                        <span>Connect Wallet to Claim</span>
                      </>
                    )}
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

            {status === "success" && (
              <div className="border border-green-500 bg-green-100 rounded-lg p-4 flex items-center space-x-2 cursor-pointer hover:bg-green-200 transition md:flex-col md:space-x-0 md:space-y-2 md:items-start">
                <ThumbsUp className="text-green-500" size={24} />
                <div className="text-sm md:text-base">
                  <span>Transaction confirmed.</span>
                  <br />
                  <a
                    href={`https://basescan.org/tx/${transactionHash}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View your transaction on the blockchain.
                  </a>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500">
                Error: {getUserErrorMessage(error)}
              </div>
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
      </main>
    </div>
  );
};

export default Home;
