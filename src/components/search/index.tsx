import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Select,
  message,
  Card,
  Divider,
  Row,
  Col,
  Typography,
} from 'antd';

import { SearchResultTable } from './SearchResultTable';

const { Option } = Select;

export const SearchComponent = () => {
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('my');
  const [searchType, setSearchType] = useState('name');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Load country list from a local country-flag.json file placed in the public folder
  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        const response = await fetch('country-flag.json');
        if (!response.ok) {
          throw new Error('网络响应错误');
        }
        const data = await response.json();
        // Map each country object to the structure required for the Select options.
        // Here we use `code` as the value and `country` as the label.
        setCountryOptions(
          data.map((item: { code: string; country: string; flag: string }) => ({
            value: item.code,
            label: item.country,
          }))
        );
      } catch (error) {
        message.error('获取国家/地区列表失败，请稍后重试。');
      }
    };

    fetchCountryOptions();
  }, []);

  // Define the columns for the table.
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '国家/地区',
      dataIndex: 'country',
      key: 'country',
      // Render the country label based on the country code
      render: (countryCode: string) => {
        const found = countryOptions.find(
          (option) => option.value === countryCode
        );
        return found ? found.label : countryCode;
      },
    },
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        message.error('未检测到登录信息，请重新登录。');
        return;
      }

      // Call the backend API.
      // Adjust the URL if your backend route is different.
      const response = await fetch('https://server-ecru-phi.vercel.app/search/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ keyword, country, searchType }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          message.error('您的登录已过期，请重新登录。');
        } else {
          message.error('搜索用户失败，请稍后重试。');
        }
        throw new Error(`HTTP 错误: ${response.status}`);
      }

      // Expecting the response format to be { data: [...] }
      const result = await response.json();
      const results = result.data || result;
      setDataSource(results);
    } catch (error: any) {
      message.error('搜索用户失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  // Options for the search type
  const searchTypeOptions = [
    { value: 'name', label: '姓名' },
    { value: 'idCard', label: '身份证号' },
    { value: 'phone', label: '电话号码' },
  ];

  return (
    <div style={{ padding: '20px' }}>
    <Card title="用户搜索">
      <Row gutter={[16, 16]} align="middle">
        {/* Country Selection */}
        <Col xs={24} sm={6} md={5}>
          <Select
            placeholder="请选择国家/地区"
            value={country}
            onChange={(value) => setCountry(value)}
            style={{ width: '100%' }}
          >
            {countryOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Search Type Selection */}
        <Col xs={24} sm={6} md={5}>
          <Select
            placeholder="请选择搜索类型"
            value={searchType}
            onChange={(value) => setSearchType(value)}
            style={{ width: '100%' }}
          >
            {searchTypeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Keyword Input - Replaced Input.Search with Input */}
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="请输入搜索关键词"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      {/* Search Button - Made Smaller */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }} justify="center">
          <Col xs={16} sm={8} md={6}>
          <Button color="purple" variant="outlined" onClick={handleSearch} loading={loading} block>
            搜索
          </Button>
        </Col>
      </Row>

      {/* Note Below the Button */}
      <Row justify="center" style={{ marginTop: 8 }}>
          <Typography.Text type="secondary">每次成功搜索将扣除 1</Typography.Text>
      </Row>

      <Divider />
      {/* Display search results */}
      <SearchResultTable data={dataSource} loading={loading} />
    </Card>
  </div>
);
};
