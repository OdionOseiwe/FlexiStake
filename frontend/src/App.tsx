import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Stake from "./pages/Stake";

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>

        <Route path="/stake" element={<Stake/>}></Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
