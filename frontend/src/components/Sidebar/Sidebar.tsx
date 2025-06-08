import { useState } from "react";
import { Menu, Button } from "antd";
import { 
  DollarOutlined, 
  WalletOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LineChartOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import "./Sidebar.css";

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
};

const items: MenuItem[] = [
  {
    key: "expenses",
    icon: <WalletOutlined />,
    label: "Expenses",
    path: "/expenses",
  },
  {
    key: "income",
    icon: <DollarOutlined />,
    label: "Income",
    path: "/income",
  },
  {
    key: "investments",
    icon: <LineChartOutlined />,
    label: "Investments",
    path: "/investments",
  },
  {
    key: "reports",
    icon: <BarChartOutlined />,
    label: "Reports",
    path: "/reports",
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [selectedKey, setSelectedKey] = useState(() => {
    const path = location.pathname;
    const item = items.find((item) => path.startsWith(item.path));
    return item ? item.key : "expenses";
  });

  const handleMenuClick = (key: string) => {
    const item = items.find((item) => item.key === key);
    if (item) {
      setSelectedKey(key);
      navigate(item.path);
    }
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="logo">
        {!collapsed && <h2>Budget Assistant</h2>}
        <Button 
          type="text" 
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
          onClick={toggleCollapsed}
          className="collapse-button"
        />
      </div>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        items={items.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
        onClick={({ key }) => handleMenuClick(key)}
      />
    </div>
  );
};

export default Sidebar;
