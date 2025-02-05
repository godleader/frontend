// path: src/components/users/Users.tsx

import React from "react";
import { useGetIdentity, useLogout, useTable } from "@refinedev/core";
import { GoogleOutlined } from "@ant-design/icons";
import { Typography, Button, List, Table } from "antd";

type IdentityType = {
    name?: string;
    imageUrl?: string;
    [key: string]: any;
};

export const Users: React.FC = () => {
    const { data: identity } = useGetIdentity<IdentityType>();
    const { Title } = Typography;

    const { tableQueryResult } = useTable<any>({
        initialSorter: [
            {
                field: "title",
                order: "asc",
            },
        ],
    });

    const { data, isLoading: tableLoading } = tableQueryResult;
    const { mutate: logout, isLoading } = useLogout();

    return (
        <div>
            <Title
                style={{
                    textAlign: "center",
                    fontSize: "2rem",
                    fontWeight: 600,
                    padding: "1rem",
                    color: "#67be23",
                }}
            >
                Simple User Listing Application
            </Title>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 1.5rem",
                }}
            >
                <Title
                    style={{
                        fontSize: "1.2rem",
                    }}
                >
                    <img
                        style={{
                            borderRadius: "50%",
                            marginRight: "1rem",
                            height: "60px",
                        }}
                        src={identity?.imageUrl}
                        alt="profile"
                    />
                    Welcome <span style={{ color: "#67be23" }}>{identity?.name}!</span>
                </Title>

                <Button
                    type="primary"
                    size="large"
                    htmlType="button"
                    icon={<GoogleOutlined />}
                    loading={tableLoading}
                    onClick={() => logout()}
                >
                    Sign out
                </Button>
            </div>
            <Table dataSource={data?.data} loading={isLoading} rowKey="id" />
            <List>
                <Table dataSource={tableQueryResult.data?.data} loading={tableQueryResult.isLoading} rowKey="id">
                    <Table.Column dataIndex="id" title="ID" sorter />
                    <Table.Column dataIndex="firstName" title="First Name" sorter />
                    <Table.Column dataIndex="lastName" title="Last Name" sorter />
                    <Table.Column dataIndex="email" title="Email" sorter />
                    <Table.Column dataIndex="birthday" title="Birthday" sorter />
                </Table>
            </List>
        </div>
    );
};

export default Users;
