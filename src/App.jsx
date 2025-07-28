import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./components/indexPage";
import SearchResultPage from "./components/SearchResultPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/search" element={<SearchResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
