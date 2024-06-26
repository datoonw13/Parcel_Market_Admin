export interface ResponseType<T> {
    data: T;
    errors: string[];
    message: string;
    statusCode: number;
  }

  export interface IPagination {
    totalCount: number
  }