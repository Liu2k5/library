import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoardLayout from "./admin/components/DashBoardLayout";
import Overall from "./admin/pages/Overall";
import Notifications from "./admin/pages/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoardLayout />}>
          <Route index element={<Overall />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
