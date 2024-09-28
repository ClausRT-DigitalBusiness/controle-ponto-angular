export type QueryParams = {
  [key: string]: any;
};

export type BaseGetResponse<T extends {}> = T & {
  id: string;
  createdAt: number;
  modifiedAt?: number;
  deletedAt?: number;
};
