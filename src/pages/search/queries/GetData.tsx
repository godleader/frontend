// path: src/pages/GetData.tsx

import React from "react";
import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";

import axios from "axios";

// Your custom authProvider
import { authProvider } from "../../../authProvider";

// Example components
import { Users } from "../../../components/users/Users";
import { Login } from "../../login";

export const GetData: React.FC = () => {
    const API_URL = "https://api.fake-rest.refine.dev";

    return (
        <Refine
            dataProvider={dataProvider(API_URL, axios)}
           
            authProvider={authProvider}
            resources={[
                {
                    name: "users",
                    list: Users,
                },
            ]}
            options={{
                reactQuery: {
                    devtoolConfig: {
                        initialIsOpen: false,
                        position: "none",
                    },
                },
            }}
            LoginPage={Login}
            Layout={({ children }) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {children}
                </div>
            )}
        />
    );
};

export default GetData;
