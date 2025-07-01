import { useMemo } from 'react';
import { useWeb3 } from '../hooks/web3';

export default function Web3Onboarding() {
  const { connectWallet, installIPFS } = useWeb3();
  
  const steps = useMemo(() => [
    {
      title: "Install Wallet",
      action: () => window.open('https://metamask.io', '_blank')
    },
    {
      title: "Enable IPFS",
      action: installIPFS
    },
    {
      title: "Connect Wallet",
      action: connectWallet
    },
    {
      title: "Allocate Storage",
      action: () => {/* Storage allocation logic */}
    }
  ], []);

  return (
    <div className="onboarding-steps">
      {steps.map((step, i) => (
        <button key={i} onClick={step.action}>
          Step {i+1}: {step.title}
        </button>
      ))}
    </div>
  );
}
