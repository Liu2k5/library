import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import SideBar from "./SideBar";

const MOCK_USER = { fullName: "Hien", username: "Hien.admin" };

export default function DashBoardLayout() {
  function handleLogout() {
    alert("Chua co API logout - cho ban lam phan Auth push code");
  }

  return (
    // flex-col: xep doc -> PHAN 1 (Topbar) tren cung, roi den hang chua PHAN 2+3
    <div className="flex min-h-screen flex-col">
      {/* PHAN 1: Topbar - Hello Admin + avatar + logout */}
      <TopBar user={MOCK_USER} onLogout={handleLogout} />

      {/* flex-1: chiem het chieu cao con lai | flex: xep PHAN 2 va 3 nam ngang */}
      <div className="flex flex-1">
        {/* PHAN 2: Sidebar - menu ben trai */}
        <SideBar />

        {/* PHAN 3: Content - doi theo trang dang chon (Tong quan / Thong bao...) */}
        <main className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
