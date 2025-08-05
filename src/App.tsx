import { useState } from 'react'
import './App.css'

function App() {
  const [usdAmount, setUsdAmount] = useState("")
  const [sourceToken, setSourceToken] = useState("ETH")
  const [targetToken, setTargetToken] = useState("BTC");
  const tokens = ["ETH", "BTC", "USDC", "SOL"];

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
            } else if (num >= 0) {
              setUsdAmount(num.toString())
            }
          }}
        />
      </div>
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
        {usdAmount
          ? `${usdAmount} USD → 0.00 ${sourceToken} → 0.00 ${targetToken}`
          : "--"}
      </div>
    </div>
  )
}

export default App
