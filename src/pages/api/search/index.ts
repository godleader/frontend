// api/search.ts

/**
 * 搜索参数类型定义
 */
export interface SearchParams {
    keyword: string;
    type: string;
  }
  
  /**
   * 搜索结果类型定义
   * 根据后端返回的数据结构修改该接口属性
   */
  export interface SearchResult {
    id: string;
    name: string;
    phone?: string;
    // 可根据实际情况增加其他字段
  }
  
  /**
   * 调用后端 /api/search 接口进行搜索
   * @param params - 包含关键词和搜索类型的搜索参数
   * @returns 返回 Promise<SearchResult[]> 搜索结果数组
   */
  export async function searchAPI(params: SearchParams): Promise<SearchResult[]> {
    const { keyword, type } = params;
    // 构造查询字符串
    const query = new URLSearchParams({
      keyword,
      type,
    });
    const url = `/api/search?${query.toString()}`;
  
    // 调用后端接口
    const response = await fetch(url, {
      method: "GET",
    });
  
    if (!response.ok) {
      // 如果请求失败，可以在这里进一步处理错误信息
      const errorText = await response.text();
      throw new Error(`API 请求失败：${errorText}`);
    }
  
    // 解析返回的 JSON 数据
    const data: SearchResult[] = await response.json();
    return data;
  }
  