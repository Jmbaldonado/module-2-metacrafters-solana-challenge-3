import React, { useEffect, useState } from "react";
import { PhantomProvider } from "./interfaces/phantom.interface";
import "./App.css";

const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }
};
const App = () => {
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );
  const [walletKey, setWalletKey] = useState<PhantomProvider | undefined>(
    undefined
  );

  useEffect(() => {
    const provider = getProvider();

    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;
    if (solana) {
      try {
        const response = await solana.connect();
        setWalletKey(response.publicKey.toString());
      } catch (err) {
        console.log(err);
      }
    }
  };

  const disconnectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (walletKey && solana) {
      await (solana as PhantomProvider).disconnect();
      setWalletKey(undefined);
    }
  };
  return (
    <div className={"App"}>
      <img src="src/assets/phantom.svg" alt="Phantom Icon" />
      <h1 className={"title text-primary"}>Connect to Phantom Wallet</h1>

      <div className={"container"}>
        {!provider ? (
          <p>
            No provider found. Install{" "}
            <a
              href="https://phantom.app/"
              target={"_blank"}
              className={"text-primary"}
            >
              Phantom Browser extension
            </a>
          </p>
        ) : provider && walletKey ? (
          <>
            <>
              <span className={"text-primary uppercase bold subtitle"}>
                Wallet Address:
              </span>
              {walletKey}
            </>
            <button
              className={"button button--primary"}
              onClick={disconnectWallet}
              type={"button"}
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <>
            <button
              className={"button button--primary"}
              onClick={connectWallet}
              type={"button"}
            >
              Connect Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
