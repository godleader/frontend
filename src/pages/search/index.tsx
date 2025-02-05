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

const { Option } = Select;

export const QueryInfoPage = () => {
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('my');
  const [searchType, setSearchType] = useState('name');
  const [dataSource, setDataSource] = useState([]);
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
        console.error('获取国家/地区列表出错:', error);
        message.error('获取国家/地区列表失败，请稍后重试。');
      }
    };

    fetchCountryOptions();
  }, []);

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
      // Look up the country label using the country code stored in the record
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

      const response = await fetch('/search/sheets', {
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

      const data = await response.json();
      setDataSource(data);
    } catch (error: any) {
      console.error('搜索用户出错:', error);
      message.error('搜索用户失败，请稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  const searchTypeOptions = [
    { value: 'name', label: '姓名' },
    { value: 'idCard', label: '身份证号' },
    { value: 'phone', label: '电话号码' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card title="用户搜索">
        {/* Use the Grid system for a responsive layout */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={6}>
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
          <Col xs={24} sm={8} md={6}>
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
          <Col xs={24} sm={8} md={12}>
            <Input.Search
              placeholder="请输入搜索关键词"
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
              搜索
            </Button>
          </Col>
        </Row>
        <Divider />
        <Table dataSource={dataSource} columns={columns} loading={loading} />
      </Card>
    </div>
  );
};
