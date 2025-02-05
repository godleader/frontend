import React from "react";
import {
  Refine,
  Authenticated,
  IResourceItem,
  Action,
} from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider } from "./rest-data-provider";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { App as AntdApp } from "antd";
import { ColorModeContextProvider } from "./contexts/color-mode";

import { Login } from "./pages/login";
import { Register } from "./pages/register";
import {
  AccountCreate,
  AccountEdit,
  AccountList,
  AccountShow,
} from "./pages/accounts";
import { QueryInfoPage } from "./pages/search";
import { WalletProvider } from "./contexts/wallet-context";

import { WalletPage } from "./pages/wallet";
import { Layout } from "./pages/layout";

// Backend endpoint from environment variable
const backend = import.meta.env.VITE_BACKEND_SERVER;

/** Helper: Convert a string to title case */
const toTitleCase = (str: string): string =>
  str
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");

/** Handler to set the document title based on resource and action */
const titleHandler = ({
  resource,
  action,
  params,
}: {
  resource?: IResourceItem;
  action?: Action;
  params?: Record<string, string | undefined>;
}): string => {
  if (resource && action && params) {
    const resourceName = toTitleCase(resource.name);
    switch (action) {
      case "list":
        return `${resourceName} | `;
      case "edit":
        return `#${params.id} Edit ${resourceName} | Zeal`;
      case "show":
        return `#${params.id} Show ${resourceName} | Zeal`;
      case "create":
        return `Create New ${resourceName} | Zeal`;
      case "clone":
        return `#${params.id} Clone ${resourceName} | Zeal`;
      default:
        return "Zeal | Building Opportunities.";
    }
  }
  return "Zeal | Building Opportunities.";
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider("https://backend-lovat-iota.vercel.app")}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={[
                  {
                    name: "accounts",
                    list: "/accounts",
                    create: "/accounts/create",
                    show: "/accounts/show/:id",
                    edit: "/accounts/edit/:id",
                    meta: { canDelete: true },
                  },
                  { name: "search", list: "/search" },
                  { name: "wallet", list: "/wallet" },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                }}
              >
 
                <Routes>
                  {/* Protected Routes */}
                  <Route
                    element={
                      <Authenticated
                        key="protected"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <Layout>
                          <Outlet />
                        </Layout>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="accounts" />}
                    />
                    <Route path="accounts">
                      <Route index element={<AccountList />} />
                      <Route path="create" element={<AccountCreate />} />
                      <Route path="show/:id" element={<AccountShow />} />
                      <Route path="edit/:id" element={<AccountEdit />} />
                    </Route>
                    <Route path="search" element={<QueryInfoPage />} />
                
                      <Route path="wallet" element={
                        <WalletProvider>
                             <WalletPage />
                             </WalletProvider>
                         } />
            

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>

                  {/* Public Auth Routes */}
                  <Route
                    element={
                      <Authenticated
                        key="public"
                        v3LegacyAuthProviderCompatible={true}
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                  </Route>
                </Routes>

                {/* Global components */}
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler handler={titleHandler} />
              </Refine>
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
};

export default App;
