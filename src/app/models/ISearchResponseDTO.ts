export interface WikiResult {
  title: string;
  pageid: number;
  snippet: string;
  timestamp: string;
}

export interface WikiResponse {
  query: {
    search: WikiResult[];
    searchinfo?: {
      totalhits: number;
    };
  };
}