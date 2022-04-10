import { PaginationType } from 'src/common';

export interface QueryConfiguration {
  take?: number;
  skip?: number;
}
export interface PayloadResponse<T, U> {
  data: T;
  metadata: U;
}
export interface Pagination {
  total: number;
  itemPage: number;
  currentPage: number;
  lastPage: number;
}

export function configQueryCondition(query: {
  page: number;
  limit: number;
}): QueryConfiguration {
  const { page = PaginationType.PAGE, limit = PaginationType.LIMIT } = query;
  const skip = limit * (page - 1);
  let config = {};
  if (page > 0) {
    config = {
      take: limit,
      skip: skip,
    };
  }
  return config;
}

export function paginateResponse(
  data: [any[], number],
  options: { page: number; limit: number },
): PayloadResponse<any, Pagination> {
  const { page, limit } = options;
  const result = data?.[0];
  // record total
  let total = data?.[1];

  // record number on a page
  let itemPage = 0;
  // current page number
  let currentPage = 0;
  // last page number
  let lastPage = 0;
  if (result && page <= 0) {
    // get all
    itemPage = result.length;
    currentPage = 1;
  } else if (result && result.length) {
    // get by paginate and have data
    lastPage = Math.ceil(total / limit);
    itemPage = result.length;
    currentPage = page;
  } else {
    // get by paginate and do data
    total = 0;
    currentPage = page;
  }

  return {
    data: [...result],
    metadata: {
      total: total,
      itemPage: itemPage,
      currentPage: currentPage,
      lastPage: lastPage,
    },
  };
}
