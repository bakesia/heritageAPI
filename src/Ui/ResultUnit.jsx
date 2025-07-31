import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XMLParser } from "fast-xml-parser";

function formatDate(date) {
  if (!date || date.length !== 8) return "날짜 정보가 잘못됨.";

  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);

  return ` ${year}/${month}/${day}`;
}

export default function ResultUnit({ item }) {
  const apiUrl = import.meta.env.VITE_API_DETAIL_URL;
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();

  const url = `${apiUrl}?ccbaKdcd=${item.ccbaKdcd}&ccbaAsno=${item.ccbaAsno}&ccbaCtcd=${item.ccbaCtcd}`;

  const detailList = [
    { label: "지역", content: detail.ccbaCtcdNm },
    { label: "소재지 상세", content: detail.ccbaLcad },
    { label: "지정일자", content: formatDate(detail.ccbaAsdt) },
  ];

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
    <div className="flex border-2 p-4 rounded-xl my-2 mx-5 gap-5 active:bg-slate-100">
      <div className="w-[25%] h-48 overflow-hidden rounded-xl">
        <img
          src={detail.imageUrl}
          alt={`${detail.ccbaMnm1} 사진`}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="flex flex-col justify-between cursor-pointer"
        onClick={() => {
          navigate(
            `/detail?ccbaKdcd=${item.ccbaKdcd}&ccbaAsno=${item.ccbaAsno}&ccbaCtcd=${item.ccbaCtcd}`,
            { state: detail }
          );
        }}
      >
        <div className="mb-2">
          <p
            className="font-bold text-lg hover:text-amber-700"
            onClick={() => {
              navigate(
                `/detail?ccbaKdcd=${item.ccbaKdcd}&ccbaAsno=${item.ccbaAsno}&ccbaCtcd=${item.ccbaCtcd}`
              );
            }}
          >
            {detail.ccbaMnm1}
          </p>
          <p>종목 구분: {detail.ccmaName}</p>
        </div>
        <div className="text-sm">
          {detailList.map((item, idx) => (
            <p key={idx}>
              <span className="font-bold">{item.label} : </span>
              <span> {item.content}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
