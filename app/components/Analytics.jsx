"use client"

import Statistics from "@/app/components/Statistics"



export default function Analytics({
    userBalance,
    userTokenBalance,
    crowdsaleBalance,
    crowdsaleTokenBalance
}) {

    return (
        <div className="analytics">
            <h2>Analytics</h2>
            <div className="analytics_program">
                <h3>Fundraiser Statistics</h3>
                <hr />
                <Statistics title={"Tokens Available"} statistic={crowdsaleTokenBalance} />
                <Statistics title={"Total SOL raised"} statistic={crowdsaleBalance} />
            </div>

            <div className="analytics_user">
                <h3>Account Statistics</h3>
                <hr />
                <Statistics title={"Token Balance"} statistic={userTokenBalance} />
                <Statistics title={"SOL balance"} statistic={userBalance} />
            </div>


        </div >
    );
}