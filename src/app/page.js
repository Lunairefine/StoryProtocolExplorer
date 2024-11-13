'use client'

import { useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

const BLOCKSCOUT_API_URL = 'https://odyssey.storyscan.xyz/api'

export default function Component() {
  const [walletAddress, setWalletAddress] = useState('')
  const [balance, setBalance] = useState(null)
  const [totalTx, setTotalTx] = useState(null)
  const [totalNFTs, setTotalNFTs] = useState(null)
  const [error, setError] = useState(null)

  const checkWalletBalance = async () => {
    setError(null)
    setBalance(null)
    setTotalTx(null)
    setTotalNFTs(null)

    try {
      // Check balance
      const balanceResponse = await axios.get(BLOCKSCOUT_API_URL, {
        params: {
          module: 'account',
          action: 'balance',
          address: walletAddress,
          apikey: process.env.NEXT_PUBLIC_BLOCKSCOUT_API_KEY,
        },
      })
      if (balanceResponse.data && balanceResponse.data.result) {
        const balanceInEth = parseFloat(balanceResponse.data.result) / 1e18
        setBalance(balanceInEth.toFixed(4))
      } else {
        setError('Wallet address tidak valid atau tidak ada data saldo.')
      }

      // Check total transactions
      const txResponse = await axios.get(BLOCKSCOUT_API_URL, {
        params: {
          module: 'account',
          action: 'txlist',
          address: walletAddress,
          apikey: process.env.NEXT_PUBLIC_BLOCKSCOUT_API_KEY,
        },
      })
      if (txResponse.data && txResponse.data.result) {
        setTotalTx(txResponse.data.result.length)
      } else {
        setError('Gagal mendapatkan data transaksi.')
      }

      // Check total NFTs
      const nftResponse = await axios.get(BLOCKSCOUT_API_URL, {
        params: {
          module: 'account',
          action: 'tokennfttx',
          address: walletAddress,
          apikey: process.env.NEXT_PUBLIC_BLOCKSCOUT_API_KEY,
        },
      })
      if (nftResponse.data && nftResponse.data.result) {
        setTotalNFTs(nftResponse.data.result.length)
      } else {
        setError('Gagal mendapatkan data NFT.')
      }
    } catch (err) {
      setError('Gagal mengambil data. Coba lagi nanti.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-grow flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-8">Story Protocol Wallet Checker</h1>
        <div className="w-full max-w-md bg-black border border-gray-600 rounded-lg p-6">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Masukkan Ethereum Wallet Address"
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 mb-4"
          />
          <button
            onClick={checkWalletBalance}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Cek Saldo & Info Lainnya
          </button>
          {balance !== null && (
            <div className="mt-4">
              <h3 className="font-semibold">Saldo Wallet:</h3>
              <p>{balance} IP</p>
            </div>
          )}
          {totalTx !== null && (
            <div className="mt-4">
              <h3 className="font-semibold">Total Transaksi:</h3>
              <p>{totalTx}</p>
            </div>
          )}
          {totalNFTs !== null && (
            <div className="mt-4">
              <h3 className="font-semibold">Total NFTs:</h3>
              <p>{totalNFTs}</p>
            </div>
          )}
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
      <footer className="w-full py-4 text-center">
        <p className="text-white">
          CREATED BY{' '}
          <Link href="https://x.com/lunairefine" target="_blank" rel="noopener noreferrer" className="text-[#00EB9A] hover:underline">
            LUNAIREFINE
          </Link>
        </p>
      </footer>
    </div>
  )
}