import React, { useState, useEffect } from 'react';
import { Select } from '@mantine/core';
import { Input } from '@mantine/core';

export const SearchBar = () => {
    const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [searchType, setSearchType] = useState('name'); // Default search type - you can adjust
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json');
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);

    const countryOptions = countries.map(country => ({
        value: country.code,
        label: country.name,
    }));

    const searchTypeOptions = [
        { value: 'name', label: 'Name' },
        { value: 'idCard', label: 'ID Card' },
        { value: 'phone', label: 'Phone' },
        // Add more search types as needed, matching your image's search options
    ];

    const handleSearch = () => {
        // Implement your search logic here using selectedCountry, searchType, and keyword
        console.log('Search parameters:', {
            country: selectedCountry,
            type: searchType,
            keyword: keyword,
        });
        // You would typically trigger an API call or perform a search operation here
    };

    return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Select
                style={{ width: '200px' }}
                placeholder="Select Country"
                data={countryOptions}
                value={selectedCountry}
                onChange={(value) => setSelectedCountry(value || '')}
                searchable
            />
            <Select
                style={{ width: '150px' }}
                placeholder="Search Type"
                data={searchTypeOptions}
                value={searchType}
                onChange={(value) => setSearchType(value || 'name')}
            />
            <Input
                style={{ width: '300px' }}
                placeholder="Enter keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} // Trigger search on Enter key
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

