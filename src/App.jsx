import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { BsList, BsHouse } from "react-icons/bs";
import NavDraw from "./Ui/NavDraw";
import IndexPage from "./components/indexPage";
import SearchResultPage from "./components/SearchResultPage";
import SbyRegionPage from "./components/SbyRegionPage";
import SbyPeriodPage from "./components/SbyPeriodPage";
import SDetailPage from "./components/SDetailPage";
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="p-2 min-h-screen">
      <header className="flex justify-between items-center text-2xl p-5 gap-2 bg-amber-100 m-3 rounded-xl">
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          <BsHouse />
        </button>
        <button
          onClick={() => {
            setIsNavOpen(true);
          }}
        >
          <BsList />
        </button>
      </header>
      <main className="m-3 rounded-xl">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/sbyperiod" element={<SbyPeriodPage />} />
          <Route path="/sbyregion" element={<SbyRegionPage />} />
          <Route path="/detail" element={<SDetailPage />} />
        </Routes>
      </main>

      {isNavOpen && <NavDraw onClose={() => setIsNavOpen(false)} />}
    </div>
  );
}

export default App;
