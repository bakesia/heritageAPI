import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { useState, useEffect } from "react";

export default function IndexPage() {
  const navigate = useNavigate();

  const [recentKeywords, setRecentKeywords] = useState(() => {
    const saved = localStorage.getItem("recentKeywords");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const keyword = e.target.keyword.value;

    if (!keyword.trim()) {
      alert("검색어를 입력해 주세요.");
      return;
    }

    setRecentKeywords((prev) => {
      const updated = [keyword, ...prev.filter((k) => k !== keyword)];
      return updated.slice(0, 5);
    });

    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  useEffect(() => {
    localStorage.setItem("recentKeywords", JSON.stringify(recentKeywords));
  }, [recentKeywords]);

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <p className="justify-center items-center flex mt-10 text-3xl">문:해</p>
      <p className="justify-center items-center flex mt-1 text-base">
        문화를 해석하다
      </p>
      <form className="flex gap-2 mt-10 mb-2" onSubmit={handleSubmit}>
        <input
          type="text"
          name="keyword"
          className="flex-grow border border-gray-300 rounded-2xl h-10 px-3"
          placeholder="검색어 입력"
        />
        <button
          type="submit"
          className="px-4 bg-blue-400 hover:bg-blue-600 text-white rounded-2xl flex items-center justify-center"
        >
          <BsSearch />
        </button>
      </form>
      <p className="text-sm ml-2"> 최근 검색어</p>
      <div className="flex gap-2 mt-2 justify-start ml-2">
        {recentKeywords.map((word, idx) => (
          <p
            key={idx}
            className="bg-slate-200 py-1 px-2 rounded-md text-sm font-bold hover:bg-slate-300"
          >
            <button
              onClick={() =>
                navigate(`/search?keyword=${encodeURIComponent(word)}`)
              }
            >
              {word}
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}
