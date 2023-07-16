import Head from 'next/head'
import React from 'react'
import { getWinningMegaNumber } from "@/lib/lottery/megamillion"

export default function Billionaire({ megaResult }) {

  const { whiteBalls, specialBall, jackpot } = megaResult;

  return (
    <>
      <Head>
        <title>Billionaire</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Billionaire</h1>
      <div>
        Megamillion Result is
        { whiteBalls.map(whiteball => (<span key={whiteball}> {whiteball} </span>)) }
        <span>{ specialBall }</span>
      </div>
      <div>
        Megamillion Jackpot is {Number(jackpot.CurrentPrizePool).toLocaleString()}
        <br />
        Cash Value is {Number(jackpot.CurrentCashValue).toLocaleString()}
      </div>
    </>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const megaResult =  await getWinningMegaNumber();

  return {
    props: {
      megaResult
    },
  }
}
