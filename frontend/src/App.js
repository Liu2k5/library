import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/admin/pages/Dashboard";

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  );
}

export default App;