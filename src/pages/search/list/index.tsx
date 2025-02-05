// path: app/social-workers/page.tsx

"use client";

import React from "react";
import {
    CreateButton,
    DeleteButton,
    EditButton,
    FilterDropdown,
    List,
    useTable,
} from "@refinedev/antd";
import { getDefaultFilter, type HttpError, useGo } from "@refinedev/core";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Space, Table, Avatar } from "antd";

// Define the SocialWorker type for REST API response.
export type SocialWorker = {
    id: number;
    name: string;
    phone?: string;
    idCard?: string;
    avatarUrl?: string;
};

export default function SocialWorkerListPage() {
    const go = useGo();

    /**
     * 1) useTable to manage list data.
     *    - resource: "socialWorkers" (should correspond to your REST API endpoint)
     *    - onSearch defines searchable fields.
     *    - filters.initial provides default filter structure.
     *    - pagination controls pagination.
     */
    const { tableProps, filters } = useTable<SocialWorker, HttpError, SocialWorker>({
        resource: "socialWorkers",
        onSearch: (values) => {
            // Returns an array of filter conditions for the REST API.
            return [
                {
                    field: "name",
                    operator: "contains",
                    value: values.name,
                },
                {
                    field: "phone",
                    operator: "contains",
                    value: values.phone,
                },
                {
                    field: "idCard",
                    operator: "contains",
                    value: values.idCard,
                },
            ];
        },
        sorters: {
            initial: [
                {
                    field: "createdAt",
                    order: "desc",
                },
            ],
        },
        filters: {
            initial: [
                {
                    field: "name",
                    operator: "contains",
                    value: undefined,
                },
                {
                    field: "phone",
                    operator: "contains",
                    value: undefined,
                },
                {
                    field: "idCard",
                    operator: "contains",
                    value: undefined,
                },
            ],
        },
        pagination: {
            pageSize: 10,
        },
    });

    return (
        <div className="page-container">
            <List
                breadcrumb={false}
                headerButtons={() => (
                    <CreateButton
                        onClick={() => {
                            // Navigate to the create page.
                            go({
                                to: {
                                    resource: "socialWorkers",
                                    action: "create",
                                },
                                options: {
                                    keepQuery: true,
                                },
                                type: "replace",
                            });
                        }}
                    />
                )}
            >
                <Table
                    {...tableProps}
                    loading={tableProps.loading}
                    pagination={{
                        ...tableProps.pagination,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        showTotal: (total) => `Total: ${total} social workers`,
                    }}
                    rowKey="id"
                    scroll={{ x: 800 }}
                >
                    {/* Name Column with search */}
                    <Table.Column<SocialWorker>
                        dataIndex="name"
                        title="社工姓名"
                        defaultFilteredValue={getDefaultFilter("name", filters)}
                        filterIcon={<SearchOutlined />}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Input placeholder="输入姓名搜索" />
                            </FilterDropdown>
                        )}
                        render={(_, record) => (
                            <Space>
                                <Avatar shape="square" src={record.avatarUrl}>
                                    {record.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <span style={{ whiteSpace: "nowrap" }}>{record.name}</span>
                            </Space>
                        )}
                    />

                    {/* Phone Column with search */}
                    <Table.Column<SocialWorker>
                        dataIndex="phone"
                        title="电话"
                        defaultFilteredValue={getDefaultFilter("phone", filters)}
                        filterIcon={<SearchOutlined />}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Input placeholder="输入电话搜索" />
                            </FilterDropdown>
                        )}
                        render={(_, record) => <span>{record.phone}</span>}
                    />

                    {/* ID Card Column with search */}
                    <Table.Column<SocialWorker>
                        dataIndex="idCard"
                        title="身份证"
                        defaultFilteredValue={getDefaultFilter("idCard", filters)}
                        filterIcon={<SearchOutlined />}
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Input placeholder="输入身份证搜索" />
                            </FilterDropdown>
                        )}
                        render={(_, record) => <span>{record.idCard}</span>}
                    />

                    {/* Actions Column: Edit and Delete */}
                    <Table.Column<SocialWorker>
                        fixed="right"
                        dataIndex="id"
                        title="操作"
                        render={(id) => (
                            <Space>
                                <EditButton hideText size="small" recordItemId={id} />
                                <DeleteButton hideText size="small" recordItemId={id} />
                            </Space>
                        )}
                    />
                </Table>
            </List>
        </div>
    );
}
