// SearchResultTable.tsx
import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface SearchResult {
  key: string;
  name: string;
  phone: string;
  idCard: string;
  country: string;
}

const columns: TableProps<SearchResult>['columns'] = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '身份证号',
    dataIndex: 'idCard',
    key: 'idCard',
  },
  {
    title: '国家/地区',
    dataIndex: 'country',
    key: 'country',
  },
];

interface SearchResultTableProps {
  data: SearchResult[];
  loading?: boolean;
}

export const SearchResultTable: React.FC<SearchResultTableProps> = ({ data, loading = false }) => {
  return (
    <Table<SearchResult>
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={(record) => record.key}
      pagination={{ pageSize: 10 }}
    />
  );
};


