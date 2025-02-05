import { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Select,
  message,
  Space,
  Card,
  Divider,
  Row,
  Col,
} from 'antd';
import React from 'react';

const { Option } = Select;

// Constants
const API_ENDPOINTS = {
  COUNTRY_LIST: '/country-flag.json',
  SEARCH: '/search/sheets',
};

interface CountryOption {
  value: string;
  label: string;
}

interface UserData {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  country: string;
}

export const QueryInfoPage = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [country, setCountry] = useState<string>('my');
  const [searchType, setSearchType] = useState<string>('name');
  const [dataSource, setDataSource] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);

  // Fetch country list on component mount
  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.COUNTRY_LIST);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCountryOptions(
          data.map((item: { code: string; country: string }) => ({
            value: item.code,
            label: item.country,
          }))
        );
      } catch (error) {
        console.error('Failed to fetch country list:', error);
        message.error('Failed to fetch country list. Please try again later.');
      }
    };

    fetchCountryOptions();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!keyword.trim()) {
      message.warning('Please enter a search keyword');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        message.error('No login information detected. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.SEARCH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ keyword, country, searchType }),
      });

      if (!response.ok) {
        handleResponseError(response.status);
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setDataSource(data);
      message.success('Search successful!');
    } catch (error) {
      console.error('Error during search:', error);
      message.error('An error occurred during the search. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle response errors
  const handleResponseError = (status: number) => {
    switch (status) {
      case 401:
        message.error('Your session has expired. Please log in again.');
        break;
      case 403:
        message.error('You do not have permission to access this resource.');
        break;
      case 404:
        message.error('The requested resource was not found.');
        break;
      case 405:
        message.error('Invalid request method. Please contact support.');
        break;
      default:
        message.error(`Search failed. Please try again later. (Status: ${status})`);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID Card',
      dataIndex: 'idCard',
      key: 'idCard',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (countryCode: string) => {
        const found = countryOptions.find((option) => option.value === countryCode);
        return found ? found.label : countryCode;
      },
    },
  ];

  // Search type options
  const searchTypeOptions = [
    { value: 'name', label: 'Name' },
    { value: 'idCard', label: 'ID Card' },
    { value: 'phone', label: 'Phone' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card title="User Search">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="Select Country"
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
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="Select Search Type"
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
          <Col xs={24} sm={8} md={12}>
            <Input.Search
              placeholder="Enter search keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24}>
            <Button type="primary" onClick={handleSearch} loading={loading} block>
              Search
            </Button>
          </Col>
        </Row>
        <Divider />
        <Table dataSource={dataSource} columns={columns} loading={loading} rowKey="id" />
      </Card>
    </div>
  );
};