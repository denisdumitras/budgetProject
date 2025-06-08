// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar/Sidebar";
import ExpensesPage from "./pages/Expenses/ExpensesPage";
import IncomePage from "./pages/Income/IncomePage";
import InvestmentsPage from "./pages/Investments/InvestmentsPage";
import ReportsPage from "./pages/Reports/ReportsPage";
import { SidebarProvider } from "./context/SidebarContext";
import "./App.css";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar />
          <Routes>
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/investments" element={<InvestmentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/" element={<Navigate to="/expenses" replace />} />
          </Routes>
        </Layout>
      </SidebarProvider>
    </Router>
  );
}

export default App;
