/**
 * 封装的通用请求函数
 * @param {string} url - API 地址
 * @param {object} options - fetch 配置选项
 * @returns {Promise} 解析后的 JSON 数据
 */
const request = async (url: string | URL | Request, options = {}) => {
  // 默认配置
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    // HTTP 状态码异常处理
    if (!response.ok) {
      class HTTPError extends Error {
        status: number;
        constructor(status: number, message: string) {
          super(message);
          this.status = status;
        }
      }
      const error = new HTTPError(response.status, `HTTP Error ${response.status}`);
      throw error;
    }

    return await response.json();
  } catch (error) {
    // 统一处理网络错误
    if (error instanceof Error && error.message === 'Failed to fetch') {
      throw new Error('Network Error: Cannot connect to server');
    }
    throw error;
  }
};

/**
 * 搜索 API 封装
 * @param {object} params - 搜索参数 
 * @param {string} params.country - 国家代码
 * @param {string} params.searchType - 搜索类型
 * @param {string} params.keyword - 关键字
 * @returns {Promise} 搜索结果数组
 */
// src/api/index.js
export const searchAPI = async (params: { country: string; searchType: string; keyword: string; }) => {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // 示例认证
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Network error');
    } else {
      throw new Error('Unknown error');
    }
  }
};