import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AuthGuard from "./components/AuthGuard";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const token = useSelector((s) => s.auth.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />

        <Route element={<AuthGuard />}>
          <Route path="/auth" element={<AuthPage />} />
        </Route>

        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/auth" replace />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
