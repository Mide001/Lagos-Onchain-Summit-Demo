import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import ClaimPage from "../components/ClaimPage";

const Home: NextPage = () => {
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
      <ClaimPage code="" />
    </main>
  </div>
  );
};

export default Home;
