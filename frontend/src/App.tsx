import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Stake from "./pages/Stake";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config/WagmiConfig';

const queryClient = new QueryClient()

function App() {

  return (
    <> 
     <ThirdwebProvider>
     <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stake" element={<Stake />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </WagmiProvider>
</ThirdwebProvider>

    </>
  )
}

export default App
