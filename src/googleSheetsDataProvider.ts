import {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
  CrudFilters,
} from "@refinedev/core";
import { google, Auth } from "googleapis";

// ==================================================================
// 1. Environment Setup & Google API Authorization
// ==================================================================

// Check that the base64-encoded credentials are provided.
const GOOGLE_CREDENTIALS_BASE64 = process.env.GOOGLE_CREDENTIALS_BASE64;
if (!GOOGLE_CREDENTIALS_BASE64) {
  throw new Error("GOOGLE_CREDENTIALS_BASE64 environment variable is not defined");
}

let GOOGLE_CREDENTIALS_JSON: any;
try {
  GOOGLE_CREDENTIALS_JSON = JSON.parse(
    Buffer.from(GOOGLE_CREDENTIALS_BASE64, "base64").toString("utf-8")
  );
} catch (error) {
  console.error("Error parsing GOOGLE_CREDENTIALS_BASE64:", error);
  throw new Error("Invalid GOOGLE_CREDENTIALS_BASE64 environment variable");
}

/**
 * Authorizes the Google API client using the provided credentials.
 */
async function authorize(): Promise<
  Auth.OAuth2Client | Auth.JWT | Auth.Compute | Auth.UserRefreshClient
> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CREDENTIALS_JSON,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    return await auth.getClient() as Auth.OAuth2Client | Auth.JWT | Auth.Compute | Auth.UserRefreshClient;
  } catch (error) {
    console.error("Google Sheets Authorization Error:", error);
    throw new Error("Failed to authorize Google Sheets API");
  }
}

/**
 * Retrieves data (rows) from a Google Spreadsheet.
 * Adjust `spreadsheetId` and `range` to match your Google Sheet.
 */
async function getSheetData(
  auth: Auth.OAuth2Client | Auth.JWT | any
): Promise<any[]> {
  try {
    const sheets = google.sheets({ version: "v4", auth });
    // TODO: Replace with your actual Spreadsheet ID.
    const spreadsheetId = "YOUR_SPREADSHEET_ID_HERE";
    // TODO: Replace with your desired range.
    const range = "Sheet1!A2:C"; // Assumes headers are in row 1.
    
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return res.data.values || [];
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error);
    throw new Error("Failed to retrieve data from Google Sheets");
  }
}

// ==================================================================
// 2. Utility: Extract Search Parameters from Filters
// ==================================================================

/**
 * Extracts the search query and search type from the Refine filters.
 *
 * Expected filters:
 *  - A filter with `field: "q"` contains the search query.
 *  - A filter with `field: "searchType"` contains the type ("name", "phone", or "idcard").
 *
 * 如果没有提供搜索类型，默认使用 "name"。
 */
function extractSearchParams(filters: CrudFilters): { query: string; searchType: string } {
  let query = "";
  let searchType = "name"; // Default search type

  if (Array.isArray(filters)) {
    for (const filter of filters) {
      if (filter.operator === "eq" && filter.field === "q" && typeof filter.value === "string") {
        query = filter.value.toLowerCase();
      }
      if (filter.operator === "eq" && filter.field === "searchType" && typeof filter.value === "string") {
        searchType = filter.value.toLowerCase();
      }
    }
  }
  return { query, searchType };
}

// ==================================================================
// 3. Custom DataProvider Implementation
// ==================================================================

// Map the search type to a column index in the spreadsheet.
const columnMapping: { [key: string]: number } = {
  name: 0,
  phone: 1,
  idcard: 2,
};

const googleSheetsDataProvider: DataProvider = {
  /**
   * Implements the `getList` method.
   *
   * It fetches rows from Google Sheets, maps them to an object shape, and then:
   *  - Applies filtering based on the search query and search type.
   *  - Applies pagination.
   */
  getList: async <TData extends BaseRecord = BaseRecord>(
    params: GetListParams
  ): Promise<GetListResponse<TData>> => {
    try {
      // 1. Authorize and fetch rows from Google Sheets.
      const auth = await authorize();
      const rows = await getSheetData(auth);

      // 2. Map the raw rows to data objects.
      // Here we assume:
      //   - id is set to the row number (starting at 1)
      //   - Column A (index 0): name, Column B (index 1): phone, Column C (index 2): idcard.
      let data = rows.map((row, index) => ({
        id: index + 1,
        name: row[0] || "",
        phone: row[1] || "",
        idcard: row[2] || "",
      }));

      // 3. Extract search parameters from the filters.
      const { query, searchType } = extractSearchParams(params.filters || []);
      if (query) {
        // Find the corresponding column index for the search type.
        const colIndex = columnMapping[searchType];
        if (colIndex === undefined) {
          throw new Error(`Unsupported search type: ${searchType}`);
        }
        // Filter the data based on the specified column.
        data = data.filter((record) => {
          const value = (record as any)[searchType] || "";
          return value.toLowerCase().includes(query);
        });
      }

      // 4. Apply pagination if provided.
      const current = params.pagination?.current || 1;
      const pageSize = params.pagination?.pageSize || data.length;
      const total = data.length;
      const start = (current - 1) * pageSize;
      const paginatedData = data.slice(start, start + pageSize) as unknown as TData[];

      return { data: paginatedData, total };
    } catch (error) {
      console.error("Error in getList:", error);
      return Promise.reject(error);
    }
  },

  // The following methods are not implemented. Add implementations if needed.
  getOne: async () => Promise.reject("Not implemented"),
  create: async () => Promise.reject("Not implemented"),
  update: async () => Promise.reject("Not implemented"),
  updateMany: async () => Promise.reject("Not implemented"),
  deleteOne: async () => Promise.reject("Not implemented"),
  deleteMany: async () => Promise.reject("Not implemented"),
  getApiUrl: () => {
    throw new Error("Function not implemented.");
  },
};

export default googleSheetsDataProvider;
