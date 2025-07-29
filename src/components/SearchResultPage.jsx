import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";
import ResultUnit from "../Ui/ResultUnit";

export default function SearchResultPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const pageUnit = import.meta.env.VITE_PAGE_UNIT;

  const location = useLocation();
  // queryparams 변수에 쿼리 값들이 key-value 값으로 저장됨
  const queryParams = new URLSearchParams(location.search);
  // get("keyword")하면 keyword 키에 해당하는 value가 변수에 저장
  const keyword = queryParams.get("keyword");

  const [items, setItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const url = `${apiUrl}?pageUnit=${pageUnit}&ccbaMnm1=${keyword}`;

  useEffect(() => {
    const apiFetch = async () => {
      try {
        const res = await fetch(url);
        const xmlText = await res.text();

        const parser = new XMLParser({
          ignoreAttributes: false,
          parseTagValue: false,
          cdataPropName: false,
        });

        const json = parser.parse(xmlText);
        const itemList = json?.result?.item;

        //console.log(itemList);

        if (!itemList) {
          console.warn("item이 없음", json?.result);
          setItems([]);
          return;
        }

        const finalList = Array.isArray(itemList) ? itemList : [itemList];

        setItems(finalList);
      } catch (err) {
        console.error(err);
        setItems([]); // 에러 시에도 빈 배열로 처리
      } finally {
        setLoading(false); // 무조건 로딩 종료
      }
    };

    apiFetch();
  }, [url]);

  useEffect(() => {
    // console.log(selectedSort);
    if (!items || items.length === 0) return;

    let sorted = [...items];

    if (selectedSort === "type") {
      sorted.sort((a, b) => a.ccmaName.localeCompare(b.ccmaName));
    } else if (selectedSort === "region") {
      sorted.sort((a, b) => a.ccbaCtcdNm.localeCompare(b.ccbaCtcdNm));
    } else if (selectedSort === "name") {
      sorted.sort((a, b) => a.ccbaMnm1.localeCompare(b.ccbaMnm1));
    }

    setSortedItems(sorted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSort, items]);

  // 페이지별로 자를 데이터 계산
  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = sortedItems.slice(startIdx, endIdx);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  if (loading) {
    return (
      <p className="flex justify-center items-center my-10 text-2xl">
        🔍 검색 결과 불러오는 중...
      </p>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <p className="flex justify-center items-center my-10 text-2xl">
        🔍 검색 결과가 존재하지 않습니다...
      </p>
    );
  }
  return (
    <div>
      <p className="flex justify-center items-center mt-5 mb-5 text-xl font-bold">
        <span className="text-amber-700">{keyword}</span>에 대한 검색 결과
      </p>
      <div className="flex justify-end">
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-md px-2 py-2 mr-5 text-sm text-center
             focus:outline-none focus:ring-1 focus:ring-amber-600 relative"
        >
          <option value="">정렬 선택</option>
          <option value="name">이름 기준</option>
          <option value="type">분류 기준</option>
          <option value="region">지역 기준</option>
        </select>
      </div>

      {/* 현재 페이지에 해당하는 아이템만 출력 */}
      {currentItems.map((item, idx) => (
        <ResultUnit key={idx} item={item} />
      ))}

      {/* 페이지 버튼 div (Array.from 메서드를 통해 아이템의
          총 갯수 대비 버튼 생성함) */}
      <div className="flex justify-center gap-2 my-6">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentPage(idx);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3 py-1 border rounded-xl text-sm font-bold ${
              currentPage === idx
                ? "bg-amber-600 text-white"
                : "bg-white text-black"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
