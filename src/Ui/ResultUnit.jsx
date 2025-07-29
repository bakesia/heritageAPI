import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";

export default function ResultUnit({ item }) {
  const apiUrl = import.meta.env.VITE_API_DETAIL_URL;
  const [detail, setDetail] = useState({});

  const url = `${apiUrl}?ccbaKdcd=${item.ccbaKdcd}&ccbaAsno=${item.ccbaAsno}&ccbaCtcd=${item.ccbaCtcd}`;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(url);
        const xmlText = await res.text();

        const parser = new XMLParser({
          ignoreAttributes: false,
          parseTagValue: false,
          cdataPropName: false,
        });

        const json = parser.parse(xmlText);
        const itemDetail = json?.result?.item;

        //console.log(itemDetail);

        if (!itemDetail) {
          console.warn("상세정보가 없음", json);
          return;
        }

        setDetail(itemDetail);
      } catch (err) {
        console.error("상세 정보 가져오기 실패", err);
      }
    };

    fetchDetail();
  }, [url]);

  return (
    <div className="flex border-2 p-4 rounded-xl my-2 mx-5 gap-5">
      <div className="w-[20%] h-48 overflow-hidden rounded-xl">
        <img
          src={detail.imageUrl}
          alt={`${detail.ccbaMnm1} 사진`}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="font-bold text-lg">
          {detail.ccbaMnm1} ({detail.ccmaName})
        </p>
        <p>지역: {detail.ccbaCtcdNm}</p>
        <p>지정일자: {detail.ccbaAsdt}</p>
      </div>
    </div>
  );
}
