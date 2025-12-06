export interface WikiResult {
  title: string;
  pageid: number;
  snippet: string;
  timestamp: string;
}

export interface WikiResponse {
  continue?: {
    sroffset: number;
    continue: string;
  };
  query: {
    search: WikiResult[];
    searchinfo?: {
      totalhits: number;
    };
  };
}