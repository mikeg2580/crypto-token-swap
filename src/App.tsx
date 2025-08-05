import { useState, useEffect } from 'react'
import { getAssetErc20ByChainAndSymbol, getAssetPriceInfo } from '@funkit/api-base';
import './App.css'

function App() {
  const [usdAmount, setUsdAmount] = useState("")
  const [sourceToken, setSourceToken] = useState("USDC")
  const [targetToken, setTargetToken] = useState("USDT");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [inputError, setInputError] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const apiKey = "Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJpQk";

  const tokenChains: Record<string, string> = {
    USDC: "1",  
    USDT: "137",
    ETH: "8453",
    WBTC: "1",  
  };

  const tokens = Object.keys(tokenChains);

  useEffect(() => {
    const fetchAllTokenPrices = async () => {
      try {
        const results = await Promise.all(
          tokens.map(async (token) => {
            const chainId = tokenChains[token];

            const tokenInfo = await getAssetErc20ByChainAndSymbol({
              chainId,
              symbol: token,
              apiKey,
            });

            const priceInfo = await getAssetPriceInfo({
              chainId,
              assetTokenAddress: tokenInfo.address,
              apiKey,
            });

            return { token, price: priceInfo.unitPrice };
          })
        );

        const newRates: Record<string, number> = {};
        results.forEach(({ token, price }) => {
          newRates[token] = price;
        });

        setRates(newRates);
      } catch (err) {
        console.error("Error fetching token data:", err);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTokenPrices();
  }, []);


  const usd = Number(usdAmount);

  const sourcePrice = rates[sourceToken];
  const targetPrice = rates[targetToken];

  const sourceAmount = usd && sourcePrice ? usd / sourcePrice : 0;
  const targetAmount = sourcePrice && targetPrice ? sourceAmount * (sourcePrice / targetPrice) : 0;

  const renderTokenOptions = (excludedToken: string) => {
    return (
      <>
        {tokens
          .filter(t => t !== excludedToken)
          .map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
      </>
    )
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      {loading && <div>Loading token prices...</div>}
      {fetchError && !loading && (
        <div style={{ color: "red"}}>
          Failed to fetch token prices. Please refresh or try again later.
        </div>
      )}
      {!loading && !fetchError &&
        (
          <>
            <h1>Token Converter</h1>
            <div style={{ padding: "1rem 0" }}>
              <label htmlFor="usd-input">Enter Amount in USD: </label>
              <input 
                id="usd-input" 
                type="number" 
                placeholder='Enter USD'
                value={usdAmount} min="0" 
                onChange={(e) => {
                  const value = e.target.value
                  const num = e.target.valueAsNumber
                  if (value === "") {
                    setUsdAmount(value)
                  } else if (num < 0) {
                    setInputError(true)
                    setUsdAmount("");
                  } else {
                    setUsdAmount(num.toString());
                    setInputError(false);
                  }
                }}
              />
            </div>
            {inputError && (
              <div style={{ color: "red", fontSize: "0.9rem" }}>USD amount cannot be negative.</div>
            )}
            <div style={{ padding: "1rem 0" }}>
              <label htmlFor="source-token">Select Source Token: </label>
              <select id="source-token" value={sourceToken} onChange={(e) => setSourceToken(e.target.value)}>
                {renderTokenOptions(targetToken)}
              </select>
            </div>
            <div style={{ padding: "1rem 0" }}>
              <label htmlFor="target-token">Select Target Token: </label>
              <select id="target-token" value={targetToken} onChange={(e) => setTargetToken(e.target.value)}>
                {renderTokenOptions(sourceToken)}
              </select>
            </div>
            <div style={{ padding: "1rem 0" }}>
              <strong>Conversion:</strong>{" "}
              {usdAmount && !inputError
                ? `${usdAmount} USD → ${sourceAmount.toFixed(6)} ${sourceToken} → ${targetAmount.toFixed(6)} ${targetToken}`
                : "--"}
            </div>
          </>
        )
      }
    </div>
  )
}

export default App
