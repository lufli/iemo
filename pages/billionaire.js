import Head from 'next/head'
import axios from 'axios'
import React from 'react'
import useSwr from 'swr'
import styles from '@/styles/billionaire.module.css'

function ResultRender(winningNumber = {}) {
  const { N1, N2, N3, N4, N5, NS, type, fetchFail } = winningNumber;

  if (!fetchFail) {
    return (
      <div>
        { type } result is
        <div className={styles['result-container']}>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N1 }</span>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N2 }</span>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N3 }</span>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N4 }</span>
          <span className={`${styles['regular-balls']} ${styles['white-balls']}`}>{ N5 }</span>
          <span className={`${styles['regular-balls']} ${styles['special-ball']}`}>{ NS }</span>
        </div>
      </div>
    )
  }
}

export default function Billionaire() {
  const { data, mutate } = useSwr('/api/get-lottery-results', axios.get, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  return (
    <>
      <Head>
        <title>Billionaire</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Billionaire</h1>
      <button onClick={mutate}>re-run</button>
      { data?.data && data.data.map(result => (
        <ResultRender {...result} key={result.type}/>
      )) }
    </>
  );
}
