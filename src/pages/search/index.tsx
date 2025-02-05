import React, { useState, useEffect } from 'react';
import { useTable } from '@refinedev/core';
import { Table, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

interface Country {
  code: string;
  name: string;
  flag: string;
}

export const QueryInfoPage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    country: '',
    searchType: '',
    keyword: '',
  });
  const [countries, setCountries] = useState<Country[]>([]);

  // 加载国家数据
  useEffect(() => {
    fetch('/country-flags.json')
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error('Failed to load country data:', error));
  }, []);

  const { tableProps } = useTable({
    resource: 'search/sheets',
    permanentFilter: [
      {
        field: 'country',
        operator: 'eq',
        value: searchParams.country,
      },
      {
        field: 'searchType',
        operator: 'eq',
        value: searchParams.searchType,
      },
      {
        field: 'keyword',
        operator: 'contains',
        value: searchParams.keyword,
      },
    ],
  });

  const onFinish = (values: any) => {
    setSearchParams(values);
  };

  return (
    <div>
      <Form form={form} onFinish={onFinish} layout="inline">
        <Form.Item name="country" label="Country">
          <Select style={{ width: 200 }} placeholder="Select a country">
            {countries.map((country) => (
              <Option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="searchType" label="Search Type">
          <Select style={{ width: 120 }}>
            <Option value="name">Name</Option>
            <Option value="phone">Phone</Option>
            <Option value="idCard">ID Card</Option>
          </Select>
        </Form.Item>
        <Form.Item name="keyword" label="Keyword">
          <Input placeholder="Enter keyword" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="phone" title="Phone" />
        <Table.Column dataIndex="idCard" title="ID Card" />
        {/* Add more columns as needed */}
      </Table>
    </div>
  );
};
