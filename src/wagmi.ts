import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  baseSepolia,
} from 'wagmi/chains';


export const config = getDefaultConfig({
  appName: 'Lagos Onchain Summit',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  chains: [
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [baseSepolia] : []),
  ],
  ssr: true,
});