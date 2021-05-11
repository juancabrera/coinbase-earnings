# Coinbase Earnings

As far as I know, there isn't an easy way to see total investment and earnings of an specific coin in Coinbase. This small script allows you to see exactly that using Coinbase API. 

### Setup
1. Create a new Coinbase API [here](https://www.coinbase.com/settings/api). Make sure to take note of the secret as you won't be able to see it later
2. Clone this repo
3. Run `yarn install`
4. Create a `.env` file at the root of the folder `coinbase-earnings`
5. Add your API key and API secret to the `.env` file following this format:
```
CAK="your-api-key-here"
CAS="your-api-secret-here"   
```
_**Note:** Make sure not to share this information with anyone!_ 

### Example
Check the invested amount and earnings of your Bitcoin account:
```
./node earnings BTC
```
Results:
```
  Currency: BTC
  Invested: $1565.83
  Total: $3149.27
  Gains: 201.12%
```

### Notes
* You will need Node 14+
