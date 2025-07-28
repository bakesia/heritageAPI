import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { BsList } from "react-icons/bs";
import NavDraw from "./Ui/NavDraw";
import IndexPage from "./components/indexPage";
import SearchResultPage from "./components/SearchResultPage";
import SbyRegionPage from "./components/SbyRegionPage";
import SbyPeriodPage from "./components/SbyPeriodPage";
import { useState } from "react";

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <BrowserRouter>
      <header className="flex justify-end items-center text-2xl p-5 gap-2">
        <button
          onClick={() => {
            setIsNavOpen(true);
          }}
        >
          <BsList />
        </button>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/sbyperiod" element={<SbyPeriodPage />} />
          <Route path="/sbyregion" element={<SbyRegionPage />} />
        </Routes>
      </main>

      {isNavOpen && <NavDraw onClose={() => setIsNavOpen(false)} />}
    </BrowserRouter>
  );
}

export default App;
