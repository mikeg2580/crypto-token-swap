# Crypto Token Swap

A simple React + TypeScript token converter that converts USD to a source token and then to a target token, using live token prices fetched from the `@funkit/api-base` SDK.

---

## Features

- Convert **USD → Source Token → Target Token** using live prices.  
- **Loading state** until token prices are fetched.  
- **Input validation**:
  - Disallows negative USD amounts  
  - Clears conversion if input is empty  
- **Dropdowns prevent selecting the same token** for source and target.  
- **Formatted results** to 6 decimal places for clarity.  

---

## Assumptions & Design Decisions

1. **Supported Tokens**  
   - Based on the take‑home PDF's "Notable Tokens to Support":  
     ```
     USDC (Chain 1 - Ethereum)  
     USDT (Chain 137 - Polygon)  
     ETH  (Chain 8453 - Base)  
     WBTC (Chain 1 - Ethereum)
     ```
   - Hard‑coded in a config object since no "list all tokens" API is provided.

2. **Pricing**  
   - Only `unitPrice` from the API is used, since the converter logic only requires USD per token.  
   - Prices are fetched **once on component mount** (no auto-refresh).

3. **Error Handling**  
   - If fetching fails, error is logged to the console.  

4. **UI Decisions**  
   - Simple inline styles for clarity, no external styling library.  
   - Results limited to 6 decimal places for readability.  
   - UX blocks negative USD input; empty input clears the conversion result.  

5. **Performance & Code Quality**  
   - `Promise.all` is used to fetch all token prices in parallel.  
   - State is guarded to avoid `NaN` values before rates load.  
   - Project is fully typed with TypeScript.

---

## Tech Stack

- **React + TypeScript** (via Vite)  
- **@funkit/api-base** for token info and price fetching  
- **Node 20+ recommended** for Vite compatibility  

---

## Future Improvements

- Auto‑refresh token prices at intervals.  
- Display user‑friendly error messages in the UI.  
- Improve input formatting for large numbers.  
- Optional: Deploy to Vercel or Netlify for a live demo.

---

## How to Run Locally

1. **Clone the Repository**

   ```bash
   git clone https://github.com/mikeg2580/crypto-token-swap.git
   cd crypto-token-swap
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Dev Server**

   ```bash
   npm run dev
   ```

4. **Open in Web Browser**
   - By default, Vite will start on: [http://localhost:5173](http://localhost:5173)