import React, { useState } from 'react';
import { Card, Input, Select, Button, List, Typography, message } from 'antd';
import googleSheetsDataProvider from '../../googleProvider';

const { Title } = Typography;
const { Option } = Select;

export const Search: React.FC = () => {
  const [field, setField] = useState<string>('email');
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query) {
      message.error("Please enter a search query");
      return;
    }
    try {
      // Use the getList method to filter data from Google Sheets.
      // Adjust the filter field names to match your Google Sheets columns.
      const response = await googleSheetsDataProvider.getList({
        resource: 'socialWorkers',
        filters: [
          {
            field: field,
            operator: "contains",
            value: query,
          },
        ],
        pagination: {
          pageSize: 10,
        },
      });
      
      // Assuming your googleSheetsDataProvider returns data in the format { data, total }
      setResults(response.data);
      message.success(`Search successful. Found ${response.total} record(s).`);
    } catch (error) {
      console.error(error);
      message.error("Search failed");
    }
  };

  return (
    <Card title={<Title level={2}>Search Records</Title>}>
      <div style={{ display: 'flex', marginBottom: 16 }}>
        <Select value={field} onChange={(value) => setField(value)} style={{ width: 120, marginRight: 8 }}>
          <Option value="email">Email</Option>
          <Option value="name">Name</Option>
          <Option value="mobile">Mobile</Option>
        </Select>
        <Input
          placeholder="Enter search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <Button type="primary" onClick={handleSearch}>Search</Button>
      </div>
      <List
        bordered
        dataSource={results}
        renderItem={(item) => (
          <List.Item>
            <div>
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Mobile:</strong> {item.mobile}</p>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Search;
