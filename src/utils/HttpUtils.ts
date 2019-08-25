//import { ErrorResponse } from 'airdcpp-apisocket';
//import i18next from 'i18next';

import LoginStore from 'stores/LoginStore';


class HTTPError extends Error {
  constructor(code: number, status: string) {
    super(`${status} (code ${code})`);

    this.status = status;
    this.code = code;
  }

  public status: string;
  public code: number;
}

export const toCorsSafeUrl = (url: string) => {
  const proxyUrl = `${window.location.origin}${getBasePath()}proxy?url=${encodeURIComponent(url)}`;
  return proxyUrl;
};

/*export const toApiError = (error: Error, t: i18next.TFunction): ErrorResponse => {
  const message = error.toString();
  return {
    code: error.status,
    message,
    json: {
      message,
    }
  };
};*/

export const fetchData = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    /*const error = new Error(`${res.statusText} (code ${res.status})`);
    error.code = res.status;
    error.status = res.statusText;
    throw error;*/

    throw new HTTPError(res.status, res.statusText);
  }

  return res;
};

export const fetchCorsSafeData = async (url: string, isJSON: boolean, options?: RequestInit) => {
  try {
    //console.log(`CORS HTTP request started (${url})`);

    const res = await fetchData(
      toCorsSafeUrl(url), 
      {
        headers: {
          'Authorization': LoginStore.authToken,
        },
        ...options,
      }
    );

    const data = await isJSON ? res.json() : res.text();
    return data;
  } catch (e) {
    console.error(`CORS HTTP request failed (${url})`, e);
    throw e;
  }
};
