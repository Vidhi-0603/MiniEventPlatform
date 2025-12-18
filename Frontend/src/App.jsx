import { useEffect, useState } from "react";
import { useAuth } from "./context/authContext";
import RegisterPage from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { MyEventsPage } from "./pages/MyEventsPage";
import { LoginPage } from "./pages/LoginPage";

export const App = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      setCurrentPage(user ? "home" : "login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    if (!user && currentPage !== "register") {
      return <LoginPage onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case "register":
        return <RegisterPage onNavigate={setCurrentPage} />;
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "myEvents":
        return <MyEventsPage onNavigate={setCurrentPage} />;
      default:
        return <LoginPage onNavigate={setCurrentPage} />;
    }
  };

  return renderPage();
};
