import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";

function formatDate(date) {
  if (!date || date.length !== 8) return "날짜 정보가 잘못됨.";

  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);

  return ` ${year}/${month}/${day}`;
}

export default function SDetailPage() {
  const apiUrl = import.meta.env.VITE_API_DETAIL_URL;
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const queryObj = Object.fromEntries(queryParams.entries());

  const url = `${apiUrl}?ccbaKdcd=${queryObj.ccbaKdcd}&ccbaAsno=${queryObj.ccbaAsno}&ccbaCtcd=${queryObj.ccbaCtcd}`;

  const [detail, setDetail] = useState(null);

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
  }, [queryObj, url]);

  if (!detail || !detail.ccbaMnm1)
    return (
      <p className="flex justify-center items-center my-10 text-2xl">
        🚫 존재하지 않는 국가유산입니다.
      </p>
    );

  const detailList = [
    {
      label: "분류",
      content: `${detail.gcodeName} / ${detail.bcodeName} / ${detail.mcodeName} / ${detail.scodeName}`,
    },
    { label: "지역", content: detail.ccbaCtcdNm },
    { label: "소재지 상세", content: detail.ccbaLcad },
    { label: "지정일자", content: formatDate(detail.ccbaAsdt) },
    { label: "내용", content: detail.content },
  ];

  // console.log(detail);

  return (
    <div className="flex flex-col justify-center items-center p-10 border-2 border-slate-600 rounded-xl">
      <div className="flex flex-col justify-center items-center mb-5 py-5 border-t-2 border-b-2 border-slate-600">
        <p className="text-2xl font-bold text-amber-700 mb-1">
          {detail.ccbaMnm1}({detail.ccbaMnm2})
        </p>
        <p className="font-bold">{detail.ccmaName}</p>
      </div>
      <img
        src={detail.imageUrl}
        alt={`${detail.ccbaMnm1} 사진`}
        className="w-[50%]"
      />

      {detailList.map((item, idx) => (
        <p key={idx}>
          {item.label} : {item.content}
        </p>
      ))}
    </div>
  );
}
