import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const token = useSelector((s) => s.auth.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!token ? <AuthPage /> : <Navigate to="/" replace />} />
        <Route path="/" element={token ? <DashboardPage /> : <Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
