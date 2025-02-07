// DataResultTable.tsx
import React from 'react';
import { Table, Result } from 'antd';
import type { TableProps } from 'antd';

interface SearchResult {
  key: string;
  name: string;
  phone: string;
  idCard: string;
  address: string;
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
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
];

interface DataResultTableProps {
  data: any[]; // The data is an array of arrays from the backend.
  loading?: boolean;
}

export const SearchResultTable: React.FC<DataResultTableProps> = ({ data, loading = false }) => {
  // Transform the backend data (array of arrays) into an array of objects.
  // Here we assume:
  //   row[0] -> 姓名 (name)
  //   row[1] -> 电话号码 (phone)
  //   row[2] -> 身份证号 (idCard) -- may be missing, so default to empty string
  //   row[3] -> 地址 (address) -- may be missing, so default to empty string
  const formattedData: SearchResult[] = data.map((row, index) => ({
    key: index.toString(),
    name: row[0] || '',
    phone: row[1] || '',
    idCard: row[2] || '',
    address: row[3] || '',
  }));

  // If not loading and there's no data, display a friendly Result.
  if (!loading && formattedData.length === 0) {
    return (
      <Result
        status="info"
        title="没有找到数据"
        subTitle="请尝试其他搜索条件。"
      />
    );
  }

  return (
    <Table<SearchResult>
      columns={columns}
      dataSource={formattedData}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};


