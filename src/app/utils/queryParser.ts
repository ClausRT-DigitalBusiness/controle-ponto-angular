import { QueryParams } from "../types/api";

export const queryParser = (query: QueryParams): string => {
  const params = Object.entries(query).reduce<Array<string>>((acc, [key, value]) => {
    if (!value) {
      return acc;
    }

    let param = '';

    if (Array.isArray(value)) {

    } else {
      param = `${key}=${value}`;
    }

    return acc.concat(param);
  }, []);

  return params.length > 0 ? `?${params.join('&')}` : '';
};
