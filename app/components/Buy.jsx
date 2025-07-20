"use client"

import { useEffect, useState, useRef } from "react"
import { PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddressSync } from "@solana/spl-token"

import config from "@/app/config.json"


export default function Buy({
    crowdsaleCost,
    crowdsaleProgram,
    user,
    provider,
    anchorProvider,
    getUserBalance,
    getCrowdsaleBalance

}) {
    const [isLoading, setIsLoading] = useState(false)
    const buyRef = useRef(null)

    const buyHandler = async () => {
        const AMOUNT = Number(buyRef.current.value) * 10 ** 9


        try {
            const transaction = await crowdsaleProgram.methods.buyTokens(AMOUNT).accounts({
                buyer: new PublicKey(user.toJSON()),
                crowdsale: new PublicKey(config.CROWDSALE_PDA),
                crowdsaleAuthority: new PublicKey(config.CROWDSALE_AUTHORITY_PDA),
                mintAccount: new PublicKey(config.TOKEN_MINT_ACCOUNT),
                ownerAccount: new PublicKey(crowdsaleProgram.provider.wallet.toJSON())
            }).transaction()

            // Latest block state
            const { blockhash, lastValidBlockHeight } = await anchorProvider.connection.getLatestBlockhash()

            // Assign  the fee payer and block hash
            transaction.feePayer = new PublicKey(user)
            transaction.recentBlockhash = blockhash

            // Wait for transaction to finish
            const { signature } = await provider.signAndSendTransaction(transaction)

            await anchorProvider.connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight
            })

            // This will set the trigger
            setIsLoading(true)

        } catch (error) {
            console.log(error)
        }

    }


    useEffect(() => {
        if (user && isLoading) {
            getUserBalance(anchorProvider)
            getCrowdsaleBalance(anchorProvider)
            setIsLoading(false)
        }
    }, [isLoading])


    return (
        <div className="buy">
            <h2> Buy Tokens</h2>
            <form action={buyHandler}>
                <input type="number" placeholder="1" min={0} max={100} step={.01} ref={buyRef} required />
                <input type="submit" value="SUBMIT" className="button" />
                <p>Price: {crowdsaleCost.toFixed(2)} SOL</p>
            </form>
        </div>
    );
}