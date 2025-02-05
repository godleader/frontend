// dataProvider.ts
import { BaseKey, BaseRecord, CustomParams, CustomResponse, DataProvider, GetListParams, GetOneParams } from "@refinedev/core";
import { google } from "googleapis";
import { dataProvider } from "./rest-data-provider";

// Replace with your Google Sheets API credentials and spreadsheet ID
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"; // IMPORTANT: Replace this
const CLIENT_EMAIL = "your-service-account-email@your-project.iam.gserviceaccount.com"; // IMPORTANT
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n`;  // IMPORTANT:  Store this securely!

// Replace with your sheet name (e.g., 'Sheet1')
const DEFAULT_SHEET_NAME = "Sheet1";

// Function to get the Google Sheets API client
const getSheetsClient = async () => {
  const jwtClient = new google.auth.JWT(
    CLIENT_EMAIL,
    undefined,
    PRIVATE_KEY.replace(/\\n/g, "\n"), // Important: Replace escaped newlines
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  await jwtClient.authorize();
  return google.sheets({ version: "v4", auth: jwtClient });
};

const googleProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource, pagination, meta }: GetListParams) => {
    const sheets = await getSheetsClient();
    const sheetName = meta?.sheetName || DEFAULT_SHEET_NAME; // Use meta if provided
    const range = `${sheetName}!A:Z`; // Get all columns from A to Z

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const values = response.data.values;
    if (!values || values.length === 0) {
      return { data: [], total: 0 };
    }

    // Assuming the first row is the header
    const headers = values[0];
    const data = values.slice(1).map((row) => {
      const rowData: Record<string, any> = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index] || null; // Handle missing values
      });

      // Add a unique 'id' field. This is crucial for Refine.
      rowData.id = rowData.id || row.join('-'); // Use a combination of columns if no 'id' exists, or you can improve this logic
      return rowData;
    });
    const { current = 1, pageSize = 10 } = pagination ?? {};
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return {
      data: data.slice(start, end) as TData[],
      total: data.length, // Important for pagination
    };
  },

  getOne: async <TData extends BaseRecord = BaseRecord>({ resource, id, meta }: GetOneParams) => {
    const sheetName = meta?.sheetName || DEFAULT_SHEET_NAME;
    const sheets = await getSheetsClient();
    const range = `${sheetName}!A:Z`;
    const { data: { values } } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    if (!values) {
      throw new Error("Sheet data is undefined.");
    }

    const headers = values[0];
    const rows = values.slice(1);
    const row = rows.find(row => (row[0] || row.join("-")) === id); //assumes ID is first, or use same logic

    if (!row) {
      throw new Error(`Record with id ${id} not found`);
    }

    const record: Record<string, any> = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? null;
    });
    record.id = id; // Ensure 'id' field.
    return { data: record as TData };
  },
  create: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, variables, meta }: { resource: string; variables: TVariables; meta?: any; }) => {
    const sheets = await getSheetsClient();
    const sheetName = meta?.sheetName || DEFAULT_SHEET_NAME;

    // Get existing headers to ensure consistent structure
    const { data: { values } } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:Z1`, // Get only the first row (headers)
    });

    const existingHeaders = values ? values[0] : [];
    const newRow: any[] = [];

    // Map variables to the correct column based on existing headers
    existingHeaders.forEach((header: string) => {
      newRow.push((variables as Record<string, any>)?.[header] ?? null); // Use null for missing values
    });

    // Add any new headers (columns) from variables that aren't already in the sheet
    if (variables) {
      for (const key in variables) {
        if (variables.hasOwnProperty(key) && !existingHeaders.includes(key)) {
          existingHeaders.push(key);
          newRow.push(variables[key]);
        }
      }
    }

    // Append the new row
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: "USER_ENTERED", // Important: How the data is interpreted
      requestBody: {
        values: [newRow],
      },
    });
    // Update the headers if new columns were added
    if (values && existingHeaders.length > values[0].length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A1:Z1`, // Update the first row (headers)
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [existingHeaders],
        },
      });
    }

    const updatedRange = appendResponse.data.updates?.updatedRange;

    if (!updatedRange) {
      throw new Error('Append failed');
    }

    // Extract ID (assuming it's in the first column)
    const match = updatedRange.match(/!A(\d+)/);
    const id = match ? match[1] : null;
    // Or construct id like getList.
    return { data: { ...variables, id } as any };

  },

  update: async <TData extends BaseRecord = BaseRecord, TVariables = {}>({ resource, id, variables, meta }: { resource: string; id: BaseKey; variables: TVariables; meta?: any; }) => {
    const sheets = await getSheetsClient();
    const sheetName = meta?.sheetName || DEFAULT_SHEET_NAME;

    //1.  Get Headers
    const { data: { values: headerValues } } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:Z1`
    });

    const headers = headerValues ? headerValues[0] : [];

    //2.  Find the row index
    const { data: { values } } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });

    if (!values) { throw new Error("No data found in sheet."); }

    const rowIndex = values.findIndex(row => (row[0] || row.join("-")) === id) + 1; // +1 because Sheets API is 1-indexed

    if (rowIndex === 0) { // -1 + 1 = 0 if not found
      throw new Error(`Record with id ${id} not found`);
    }
    const updatedRow: any[] = [];

    // Map variables to the correct column based on existing headers
    headers.forEach(header => {
      updatedRow.push((variables as Record<string, any>)?.[header] ?? null);
    });


    //3. Update values
    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`, // Update the specific row
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [updatedRow],
      },
    });
    return { data: { ...variables, id } as any };

  },

  deleteOne: async ({ resource, id, variables, meta }: { resource: string; id: BaseKey; variables?: any; meta?: any; }) => {
    const sheets = await getSheetsClient();
    const sheetName = meta?.sheetName || DEFAULT_SHEET_NAME;

    // Find the row index
    const { data: { values } } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`, // Check all rows and columns
    });

    if (!values) { throw new Error('Sheet data is undefined.'); }

    const rowIndex = values.findIndex(row => (row[0] || row.join("-")) === id) + 1; // +1 for 1-based indexing

    if (rowIndex === 0) {
      throw new Error(`Record with id ${id} not found`);
    }

    // To delete a row, we need to use the spreadsheets.batchUpdate method
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: 0, // Assuming you want to delete from the first sheet, often ID is 0
              dimension: "ROWS",
              startIndex: rowIndex - 1, //  API is zero-indexed for startIndex/endIndex
              endIndex: rowIndex, //  Delete only the one row
            }
          }
        }],
      },
    });

    return { data: { id } as any }; // Return the deleted ID
  },
  getMany: async ({ resource, ids, meta }) => {
    const sheets = await getSheetsClient();
    const sheetName = meta?.sheetName || DEFAULT_SHEET_NAME;

    // Get all data from the sheet
    const { data: { values } } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });

    if (!values) {
      return { data: [] }; // Return an empty array if no data is found
    }

    const headers = values[0];
    const rows = values.slice(1);

    const records = ids.map(id => {
      const row = rows.find(row => (row[0] || row.join('-')) === id);
      if (!row) return null; //or throw error.

      const record: Record<string, any> = {};
      headers.forEach((header, index) => {
        record[header] = row[index] ?? null;
      });
      record.id = id; // Ensure the 'id' field.
      return record;

    }).filter(Boolean); // Remove nulls (records not found)

    return { data: records as any[] };
  },
  custom: async <TData extends BaseRecord = BaseRecord, TQuery = unknown, TPayload = unknown>({ url, method, payload, query, headers, meta }: CustomParams<TQuery, TPayload>): Promise<CustomResponse<TData>> => {
    const sheets = await getSheetsClient();
    const sheetName = meta?.sheetName || DEFAULT_SHEET_NAME;

    if (url.endsWith("/search/sheets") && method === "post") {
      const { keyword, country, searchType } = payload as {
        keyword: string;
        country: string;
        searchType: string;
      };
      const range = `${sheetName}!A:Z`;

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
      });

      const values = response.data.values;
      if (!values) {
        return { data: [] };
      }

      const headers = values[0];
      const data = values.slice(1).map((row, index) => {
        const rowData: Record<string, any> = {};
        headers.forEach((header, i) => {
          rowData[header] = row[i] || null;
        });
        // Use a consistent id, even if 'id' column is missing.
        rowData.id = rowData.id || `row-${index + 2}`; // +2 because of header row and 1-based indexing
        return rowData;
      });

      const filteredData = data.filter((item) => {
        const countryMatches = item.country === country;

        let keywordMatches = false;
        if (searchType === 'name') {
          keywordMatches = item.name?.toLowerCase().includes(keyword.toLowerCase());
        } else if (searchType === 'idCard') {
          keywordMatches = item.idCard?.toLowerCase().includes(keyword.toLowerCase());
        } else if (searchType === 'phone') {
          keywordMatches = item.phone?.toLowerCase().includes(keyword.toLowerCase());
        }

        return countryMatches && keywordMatches;
      });

      return { data: filteredData as TData[] };
    }

    throw new Error(`Unsupported method ${method} or url ${url}`);
  },
  getApiUrl: function (): string {
    throw new Error("Function not implemented.");
  }
};

export default dataProvider;