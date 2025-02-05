import React, { useState, useEffect, useCallback } from 'react';
import { CrudFilter, useTable } from '@refinedev/core';
import { Table, Form, Input, Select, Button, Spin } from 'antd';
import { debounce } from 'lodash'; // 需要安裝 lodash

const { Option } = Select;

interface Country {
    code: string;
    name: string;
    flag: string;
}

interface SearchParams {
    country?: string;
    searchType?: string;
    keyword?: string;
}

// Helper function to create filters
const buildFilters = (params: SearchParams): CrudFilter[] => {
    const filters: CrudFilter[] = [];

    if (params.country) {
        filters.push({ field: 'country', operator: 'eq', value: params.country });
    }
    if (params.searchType) {
        filters.push({ field: 'searchType', operator: 'eq', value: params.searchType });
    }
    if (params.keyword) {
        filters.push({ field: 'keyword', operator: 'contains', value: params.keyword });
    }

    return filters;
};

export const QueryInfoPage: React.FC = () => {
    const [form] = Form.useForm();
    const [searchParams, setSearchParams] = useState<SearchParams>({});
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchCountryData = async () => {
            setLoading(true);
            try {
                const cachedCountries = localStorage.getItem('countries');
                if (cachedCountries) {
                    setCountries(JSON.parse(cachedCountries));
                } else {
                    const response = await fetch('/country-flags.json');
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    const data = await response.json();
                    setCountries(data);
                    localStorage.setItem('countries', JSON.stringify(data));
                }
            } catch (error) {
                console.error('Failed to load country data:', error);
                setError('Failed to load country data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCountryData();
    }, []);

    const filters = buildFilters(searchParams);

    const { tableQueryResult } = useTable({
        resource: 'search/sheets',
        filters: { initial: filters },
        pagination: {
            pageSize: pageSize,
        },
    });

    const debouncedOnFinish = useCallback(debounce((values: SearchParams) => {
        setSearchParams(values);
    }, 300), []);

    return (
        <div style={{ padding: '20px' }}>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Form
                form={form}
                onFinish={debouncedOnFinish}
                layout="inline"
                initialValues={{ country: '', searchType: '', keyword: '' }}
            >
                <Form.Item name="country" label="Country">
                    <Select
                        style={{ width: 200 }}
                        placeholder="Select a country"
                        loading={loading}
                    >
                        {countries.map((country) => (
                            <Option key={country.code} value={country.code}>
                                {country.flag} {country.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="searchType" label="Search Type">
                    <Select style={{ width: 120 }} placeholder="Select type">
                        <Option value="name">Name</Option>
                        <Option value="phone">Phone</Option>
                        <Option value="idCard">ID Card</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="keyword" label="Keyword">
                    <Input placeholder="Enter keyword" allowClear />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={tableQueryResult.isLoading}>
                        Search
                    </Button>
                </Form.Item>
            </Form>

            <Spin spinning={tableQueryResult.isLoading}>
                {tableQueryResult.error ? (
                    <div>Error loading data: {tableQueryResult.error.message}</div>
                ) : (
                    <Table 
                        dataSource={tableQueryResult.data?.data || []} 
                        rowKey="id" 
                        pagination={{ 
                            pageSize: pageSize, 
                            onShowSizeChange: (_, size) => setPageSize(size) 
                        }}
                    >
                        <Table.Column dataIndex="name" title="Name" />
                        <Table.Column dataIndex="phone" title="Phone" />
                        <Table.Column dataIndex="idCard" title="ID Card" />
                    </Table>
                )}
            </Spin>
        </div>
    );
};