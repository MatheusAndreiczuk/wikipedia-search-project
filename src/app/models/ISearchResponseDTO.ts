export interface WikiResult {
  title: string;
  pageid: number;
  snippet: string;
  timestamp: string;
  dist?: number;
}

export interface WikiResponse {
  continue?: {
    sroffset: number;
    continue: string;
  };
  query: {
    search?: WikiResult[];
    geosearch?: WikiResult[];
    searchinfo?: {
      totalhits: number;
    };
  };
}