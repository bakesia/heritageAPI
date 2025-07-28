import { useState, useEffect } from "react";
import { xml2json } from "xml-js";

export default function IndexPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const pageUnit = import.meta.env.VITE_PAGE_UNIT;

  const [items, setItems] = useState([]);
  const name = "";
  const url = `${apiUrl}?pageUnit=${pageUnit}&ccbaMnm1=${name}`;

  useEffect(() => {
    const apif = async () => {
      try {
        const res = await fetch(url);
        const xmlText = await res.text();
        const json = JSON.parse(xml2json(xmlText, { compact: true })); // XML → JSON
        const itemList = json?.result?.item;

        console.log(itemList);

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

    apif();
  }, []);

  return (
    <div>
      <ol>
        {items.map((item, idx) => (
          <li key={idx}>
            {" "}
            {idx + 1}.{item.ccbaMnm1?._cdata} ({item.ccmaName?._cdata}) -{" "}
            {item.ccbaCtcdNm?._cdata}
          </li>
        ))}
      </ol>
    </div>
  );
}
