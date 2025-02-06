import  { useContext, useEffect, useState } from "react";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity, useActiveAuthProvider } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Button,
  Switch,
  Typography,
  theme,
  message,
  Spin,
} from "antd";
import { ColorModeContext, ColorModeContextType } from "../../contexts/color-mode";
import { useResponsive } from "antd-style";
import { WalletContext } from "../../contexts/wallet-context";
import React from "react";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  walletBalance: number;
  avatar: string;
};

export const ThemedHeaderV2: React.FC<{ isSticky?: boolean; sticky?: boolean; }> = ({
  sticky,
}) => {
  const { token } = useToken();
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const { mode, toggleMode } = useContext<ColorModeContextType>(ColorModeContext);
  const responsive = useResponsive();
  // Assume "xs" true means we are on a mobile device
  const isMobile = responsive.xs;

  const [loginHistory, setLoginHistory] = useState([]);
  const [walletBalance, setWalletBalance] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shouldRenderHeader = user && (user.name || user.avatar || user.walletBalance);

  // Fetch wallet balance from the backend
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      // Uncomment and update the API endpoint when available.
      /*
      fetch(`/api/users/${user.id}/walletBalance`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch wallet balance");
          }
          return response.json();
        })
        .then((data) => {
          setWalletBalance(data.walletBalance);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          message.error("Failed to fetch wallet balance");
        })
        .finally(() => {
          setLoading(false);
        });
      */
      setLoading(false);
    }
  }, [user?.id]);

  // Dynamically update menu items with fetched data
  const menuItems = [
    { key: "username", label: `Username: ${user?.name || "N/A"}` },
    { key: "walletBalance", label: `Balance: ${user?.walletBalance}` },
    { key: "history", label: "History Search" },
  ];

  if (!shouldRenderHeader) {
    return null;
  }

  // Base header styles
  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    padding: "0px 24px",
    height: "64px",
    display: "flex",
    alignItems: "center",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  const handleClick = (key: string) => {
    message.info(`You clicked: ${key}`);
    // Add your logic here based on the key
  };

  return (
    <AntdLayout.Header style={headerStyles}>
      {isMobile ? (
        // Mobile layout: stack items vertically
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Space style={{ width: "100%", justifyContent: "center" }}>
            {menuItems.map((item) => (
              <Button key={item.key} onClick={() => handleClick(item.key)}>
                {item.label}
              </Button>
            ))}
          </Space>
          <Space style={{ width: "100%", justifyContent: "center" }}>
            <Switch
              checkedChildren="🌛"
              unCheckedChildren="🔆"
              onChange={toggleMode}
              defaultChecked={mode === "dark"}
            />
          </Space>
          <Space style={{ width: "100%", justifyContent: "center" }}>
            {user?.name && <Text strong>{user.name}</Text>}
            {user?.avatar && (
              <Avatar src={user?.avatar} alt={user?.name} />
            )}
          </Space>
        </Space>
      ) : (
        // Desktop layout: items arranged in a row
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            {menuItems.map((item) => (
              <Button key={item.key} onClick={() => handleClick(item.key)}>
                {item.label}
              </Button>
            ))}
          </Space>
          <Switch
            checkedChildren="🌛"
            unCheckedChildren="🔆"
            onChange={toggleMode}
            defaultChecked={mode === "dark"}
          />
          <Space>
            {user?.name && <Text strong>{user.name}</Text>}
            {user?.avatar && (
              <Avatar src={user?.avatar} alt={user?.name} />
            )}
          </Space>
        </Space>
      )}
    </AntdLayout.Header>
  );
};
