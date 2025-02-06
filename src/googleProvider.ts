export class googleProvider {
  static getList(arg0: { resource: string; filters: { field: string; operator: string; value: string; }[]; pagination: { pageSize: number; }; }) {
    throw new Error('Method not implemented.');
  }
  constructor() {
    // Removed assignment to fix the type error
  }

  async getLongRoutes() {
    return this.getRoutes('long');
  }

  async getShortRoutes() {
    return this.getRoutes('short');
  }

  async getRoutes(tableName: string) {
    const response = await fetch(this.getDataSheetUrl(tableName));
    const responseJson = await response.json();
    return this.readData(responseJson.values);
  }

  getDataSheetUrl(tableName: any){
    return `https://sheets.googleapis.com/v4/spreadsheets/1zgT74PMvCWC4LGKk_lVo7qN1gmpuNXWmcsuYg4PU7Fo/values/${tableName}?key=${process.env.REACT_APP_SHEETS_ACCESS_KEY}`;
  }

  readData(rawData: string | any[]) {
    var headerColumns = rawData[0];
    var data = [];
    for (var row = 1; row < rawData.length; row++) {
      var record: { [key: string]: any } = {};
      for (var headerColumn in headerColumns) {
        record[headerColumns[headerColumn]] = rawData[row][headerColumn];
      }

      data.push(record);
    }

    return data;
  }
}

export default googleProvider;