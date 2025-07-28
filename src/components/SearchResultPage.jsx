import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";

export default function SearchResultPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const pageUnit = import.meta.env.VITE_PAGE_UNIT;

  const location = useLocation();
  // queryparams 변수에 쿼리 값들이 key-value 값으로 저장됨
  const queryParams = new URLSearchParams(location.search);
  // get("keyword")하면 keyword 키에 해당하는 value가 변수에 저장
  const keyword = queryParams.get("keyword");

  const [items, setItems] = useState([]);
  const url = `${apiUrl}?pageUnit=${pageUnit}&ccbaMnm1=${keyword}`;

  useEffect(() => {
    const apiFetch = async () => {
      try {
        const res = await fetch(url);
        const xmlText = await res.text();

        const parser = new XMLParser({
          ignoreAttributes: false,
          parseTagValue: true,
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
      }
    };

    apiFetch();
  }, [url]);

  return (
    <div>
      <p>{keyword}에 대한 검색 결과</p>
      <ol>
        {items.map((item, idx) => (
          <li key={idx}>
            {" "}
            {idx + 1}.{item.ccbaMnm1} ({item.ccmaName}) - {item.ccbaCtcdNm}
          </li>
        ))}
      </ol>
    </div>
  );
}
