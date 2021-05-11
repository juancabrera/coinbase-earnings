import { getAccountTotalInvested, getAccountBalance } from './utils.js'


(async () => {
  if (!process.argv[2]) return;
  
  let currency = process.argv[2]
  let totalInvested = await getAccountTotalInvested(currency)
  let accountBalanceResponse = await getAccountBalance(currency)
  let totalETH = parseFloat(accountBalanceResponse.data.native_balance.amount)
  console.log(`
  Currency: ${currency}
  Invested: $${totalInvested.toFixed(2)}
  Total: $${totalETH.toFixed(2)}
  Gains: ${parseFloat((totalETH / totalInvested) * 100).toFixed(2)}%
  `)
})()
