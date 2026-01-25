import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AuthGuard from "./components/AuthGuard";
import NotFoundPage from "./pages/NotFoundPage";
import MainPage from "./pages/MainPage";
import ChatoDocsPage from "./pages/ChatoDocsPage";

export default function App() {
  const token = useSelector((s) => s.auth.token);

  return (
    <BrowserRouter>
      <Routes>
<Route
  path="/"
  element={token ? <Navigate to="/dashboard" replace /> : <MainPage />}
/>
<Route
  path="/sdk-docs"
  element={<ChatoDocsPage />}
/>


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
