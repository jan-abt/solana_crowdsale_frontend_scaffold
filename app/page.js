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

// Import components
import Header from "./components/Header"

// Import config & IDL
import config from "./config.json"
import Crowdsale from "./idl/crowdsale.json"
import { CONFIG_FILES } from "next/dist/shared/lib/constants"



export default function Home() {
  // state manaement
  const [provider, setProvider] = useState(null)
  const [anchorProvider, setAnchorProvider] = useState(null)
  const [user, setUser] = useState(null)
  const [userBalance, setUserBalance] = useState(0)
  const [userTokenBalance, setUserTokenBalance] = useState(0)
  const [crowdsaleProgram, setCrowdsaleProgram] = useState(null)
  const [crowdsaleBalance, setCrowdsaleBalance] = useState(0)
  const [crowdsaleCost, setCrowdsaleCost] = useState(0)

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
          const crowdsaleProgram = new Program(Crowdsale, anchorProvider)
          setCrowdsaleProgram(crowdsaleProgram)

          // Fetch Crowdsale state
          const crowsaleState = await crowdsaleProgram.account.crowdsale.fetch(config.CROWDSALE_PDA)
          setCrowdsaleCost(crowsaleState.cost)

          // Fetch Balance
          await getUserBalance(anchorProvider)
          await getCrowdsaleBalance(anchorProvider)

         // await getCrowdsaleBalance(anchorProvider)
        })
        // disconnect from phantom wallet
        provider.on("disconnect", () => {
          setUser(null)
        })
      }

    }

  }

  const getUserBalance = async (anchorProvider) => {

    const userPubKey = new PublicKey(anchorProvider.wallet)
    const tokenPubKey = new PublicKey(config.TOKEN_MINT_ACCOUNT)
    const userBalance = await anchorProvider.connection.getBalance(userPubKey)
    setUserBalance(userBalance)

    const userTokenAccount = getAssociatedTokenAddressSync(tokenPubKey, userPubKey, true)
    const userTokenAccountInfo = await anchorProvider.connection.getAccountInfo(userTokenAccount)
    
    if(userTokenAccountInfo){
      const userTokenBalance = await anchorProvider.connection.getTokenAccountBalance(userTokenAccount)
      setUserTokenBalance(userTokenBalance.value.account)
    }

  }

  const getCrowdsaleBalance = async (anchorProvider) => {

    const crowdsalePDAKey = new PublicKey(config.CROWDSALE_PDA)
    const crowdsalePDATokenKey = new PublicKey(config.CROWDSALE_PDA_TOKEN_ACCOUNT)
    
    const crowdsaleBalance = await anchorProvider.connection.getBalance(crowdsalePDAKey)
    setCrowdsaleBalance(crowdsaleBalance)

    const crowdsaleTokenBalance = await anchorProvider.connection.getBalance(crowdsalePDATokenKey)
    setCrowdsaleBalance(crowdsaleTokenBalance)


  }

  useEffect(() => {
    getProvider()
  }, [])

  return (
    <div className="page">
      <Header provider={provider} user={user} setUser={setUser} />
      <main className="main">
        <div className="hero">
          <h1>Introducing sDAPP</h1>
          <p>Join our community today!</p>
        </div>
      </main >
    </div >
  );
}