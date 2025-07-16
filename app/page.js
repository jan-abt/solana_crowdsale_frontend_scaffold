"use client"
// Callback for dependency updates
// Get or update state
import { useEffect, useState } from "react"
// Utility to build address to connect to the different Solana cluster such as devnet, testnet, mainnet
// Connect to the network
// Help identify which addresses are Solana public keys
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"
// Token accounts for SPL token, read data from SPL tokens
// in Solana each token has a differnt address
import { getAssociatedTokenAddressSync } from "@solana/spl-token"
// Utility to connect to the block chain
import { AnchorProvider, Program } from "@coral-xyz/anchor"

// Import config & IDL
import config from "@/app/config.json"
import Crowdsale from "@/app/idl/crowdsale.json"



export default function Home() {

  // state manaement
  const [provider, setProvider] = useState(null)
  const [anchorProvider, setAnchorProvider] = useState(null)
  const [user, setUser] = useState(null)

  const getProvider = async () => {
    if ("phantom" in window) { // phantom installed?
      const provider = window.phantom?.solana

      if (provider?.isPhantom) {
        setProvider(provider)

        provider.on("connect", async (pubKey) => {
          const connection = new Connection(clusterApiUrl("devnet"), "confirmed")
          // allows us to sign transaction usinf the publi key
          const anchorProvider = new AnchorProvider(connection, pubKey)

          // Set anchor connection and user
          setAnchorProvider(anchorProvider)
          setUser(pubKey)

          // Get Crowdsale program

          // Fetch Crowdsale state

          // Fetch Balance
          await getUserBalance(anchorProvider)
        })
        // disconnect from phantom wallet
        provider.on("disconnect", () =>{
          setUser(null)
        })
      }

    }

  }

  return (
    <div className="page">
      <main className="main">
        <div className="hero">
          <h1>Introducing sDAPP</h1>
          <p>Join our community today!</p>
        </div>
      </main >
    </div >
  );
}