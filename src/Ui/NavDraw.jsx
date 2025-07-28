import { BsHouse, BsX, BsClock } from "react-icons/bs";
import { GiSouthKorea } from "react-icons/gi";
import { Link } from "react-router-dom";

export default function NavDraw({ onClose }) {
  const navList = [
    { label: "홈", path: "/", icon: <BsHouse /> },
    { label: "시기별 검색", path: "/sbyperiod", icon: <BsClock /> },
    { label: "지역별 검색", path: "/sbyregion", icon: <GiSouthKorea /> },
  ];

  return (
    <div className="fixed inset-0 z-40 animate-slide-in">
      <div className="absolute right-0 top-0 h-full w-64 bg-slate-50 shadow-xl p-4 animate-slide-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">메뉴</h2>
          <button onClick={onClose}>
            <BsX size={24} />
          </button>
        </div>
        <ul className="space-y-2">
          {navList.map((item, idx) => (
            <li
              key={idx}
              onClick={onClose}
              className="hover:bg-slate-200 rounded-lg pl-5"
            >
              <Link to={item.path}>
                <span className="flex gap-1">
                  <span className="mt-1">{item.icon}</span>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
