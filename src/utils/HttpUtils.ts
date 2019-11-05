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

export const fetchData = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (!res.ok) {
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

          // Temp workaround for people upgrading from versions < 2.7.0
          // If the new UI was loaded before restarting the app, a cache expiration time of 
          // one year would have been set for "Not found" errors...
          'Cache-Control': 'no-store'
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
