
import dotenv from "dotenv"
import crypto from "crypto"
import fetch from "node-fetch"

dotenv.config()

const apiKey = process.env.CAK;
const apiSecret = process.env.CAS;
let timestamp = Math.floor(Date.now() / 1000);

function getSignature(req) {
  const message = timestamp + req.method + req.path + req.body;
  return crypto.createHmac("sha256", apiSecret).update(message).digest("hex")
}
export async function listAccounts() {
  const path = `/v2/accounts?&limit=100&order=asc`
  const req = {
    method: 'GET',
    path: path,
    body: ''
  }
  const signature = getSignature(req)
  let r = await fetch(`https://api.coinbase.com${path}`,
  {
    method: req.method,
    headers: {
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-KEY': apiKey
    }
  })
  return r.json()
}

export async function getWalletAccountID(currency) {
  let walletAccountID = null;
  let accounts = await listAccounts()
  accounts.data.forEach(waid => {
    if (waid.currency == currency) {
      walletAccountID = waid.id
      return walletAccountID
    }
  })
  return walletAccountID
}

export async function getAccountTransactions(accountID, nextURL) {
  let path = `/v2/accounts/${accountID}/transactions?&limit=100`
  if (nextURL != null) {
    path = nextURL
  }

  const req = {
    method: 'GET',
    path: path,
    body: ''
  }
  const signature = getSignature(req)
  let r = await fetch(`https://api.coinbase.com${path}`,
  {
    method: req.method,
    headers: {
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-KEY': apiKey
    }
  })
  return r.json()
}

export async function getAccountTotalInvested(currency) {
  let total = 0
  let accountID = await getWalletAccountID(currency)
  let transactions = null

  do {
    transactions = await getAccountTransactions(accountID, transactions != null ? transactions.pagination.next_uri : null)
    transactions.data.forEach(t => total += parseFloat(t.native_amount.amount))
  } while (transactions.pagination.next_uri != null)

  return total
}

export async function getAccountBalance(currency) {
  let accountID = await getWalletAccountID(currency)
  let path = `/v2/accounts/${accountID}`
  const req = {
    method: 'GET',
    path: path,
    body: ''
  }
  const signature = getSignature(req)
  let r = await fetch(`https://api.coinbase.com${path}`,
    {
      method: req.method,
      headers: {
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-KEY': apiKey
      }
    })
  return r.json()
}
