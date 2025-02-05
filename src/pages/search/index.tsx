import { useState, useEffect } from 'react';
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
} from 'antd';
import { useApiUrl, useNavigation, useTranslate } from "@refinedev/core";


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
  const apiUrl = useApiUrl();
  const { push } = useNavigation();
  const translate = useTranslate();

  // Load country list from a local country-flag.json file
  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        const response = await fetch('/country-flag.json');
        if (!response.ok) {
          throw new Error(translate('common.errors.network', 'Network response was not ok'));
        }
        const data = await response.json();
        setCountryOptions(
          data.map((item: { code: string; country: string }) => ({
            value: item.code,
            label: item.country,
          }))
        );
      } catch (error) {
        console.error('Error fetching country list:', error);
        message.error(translate('common.errors.fetchCountry', 'Failed to fetch country list, please try again later.'));
      }
    };

    fetchCountryOptions();
  }, [translate]);


    const columns = [
        {
            title: translate('fields.name', 'Name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: translate('fields.idCard', 'ID Card Number'),
            dataIndex: 'idCard',
            key: 'idCard',
        },
        {
            title: translate('fields.phone', 'Phone Number'),
            dataIndex: 'phone',
            key: 'phone',
        },
        {
          title: translate('fields.country', 'Country/Region'),
          dataIndex: 'country',
          key: 'country',
          render: (countryCode: string) => {
            const found = countryOptions.find((option) => option.value === countryCode);
            return found ? found.label : countryCode;
          },
        },
    ];



  const handleSearch = async () => {
    if (!keyword.trim()) {
      message.warning(translate('common.errors.emptyKeyword', 'Please enter a search keyword'));
      return;
    }

    setLoading(true);
    try {

      const response = await fetch(`${apiUrl}/search/sheets`, {  // Use apiUrl
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Or use refine's auth helpers
        },
        body: JSON.stringify({ keyword, country, searchType }),
      });

      if (!response.ok) {
        switch (response.status) {
          case 401:
            message.error(translate('common.errors.unauthorized', 'Your session has expired, please log in again.'));
            // Optionally redirect to login page here using refine's navigation
             push("/login");  // Redirect to the login route
            break;
          case 403:
            message.error(translate('common.errors.forbidden', 'You do not have permission to access this resource.'));
            break;
          case 404:
            message.error(translate('common.errors.notFound', 'Resource not found.'));
            break;
          case 405:
            message.error(translate('common.errors.methodNotAllowed', "Method Not Allowed. Check your API endpoint's allowed methods."));
            break;
          default:
            message.error(translate('common.errors.searchFailed', {status: response.status}, `Search failed, please try again later. (Status code: ${response.status})`));
        }
        throw new Error(`HTTP error! Status: ${response.status}`); // Still throw for the catch block
      }

      const data = await response.json();
      setDataSource(data);
      message.success(translate('common.messages.searchSuccess', 'Search successful!'));

    } catch (error) {
      console.error("An error occurred during the search:", error);
      message.error(translate('common.errors.searchError', 'An error occurred during the search, please try again later.'));
    } finally {
      setLoading(false);
    }
  };


  const searchTypeOptions = [
    { value: 'name', label: translate('fields.name', 'Name') },
    { value: 'idCard', label: translate('fields.idCard', 'ID Card Number') },
    { value: 'phone', label: translate('fields.phone', 'Phone Number') },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Card title={translate('pages.userSearch.title', 'User Search')}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder={translate('placeholders.selectCountry', "Select Country/Region")}
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
              placeholder={translate('placeholders.selectSearchType', "Select Search Type")}
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
              placeholder={translate('placeholders.enterKeyword', "Enter search keyword")}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        <Divider />
        <Table dataSource={dataSource} columns={columns} loading={loading} rowKey="id" />
      </Card>
    </div>
  );
};