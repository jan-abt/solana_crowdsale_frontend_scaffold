"use client"

import { LAMPORTS_PER_SOL } from "@solana/web3.js"


export default function Statistics({
    title,
    statistic
}) {
    return (
        <div className="flex--between">
            <h4>{title}</h4>
            <p>{statistic / LAMPORTS_PER_SOL}</p>
        </div >
    );
}