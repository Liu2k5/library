import { Link, useLocation } from "react-router-dom";

// Danh sach menu -> them muc moi o day khi lam toi trang tiep theo
const MENU_ITEMS = [
  { to: "/", label: "Tong quan" },
  { to: "/notifications", label: "Thong bao" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    // w-60: width 240px | bg-blue-800: nen xanh dam | text-white | p-4: padding 16px
    <aside className="w-60 bg-blue-800 p-4 text-white">
      <h2 className="mb-8 text-xl font-bold">NexaCloud</h2>

      <nav className="space-y-2">
        {MENU_ITEMS.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "block rounded p-2 " +
                (active ? "bg-blue-700" : "hover:bg-blue-700")
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
