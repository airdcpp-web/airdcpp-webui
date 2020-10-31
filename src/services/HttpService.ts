import LoginStore from 'stores/LoginStore';
import { fetchData } from 'utils/HttpUtils';


export const uploadTempFile = async (file: File): Promise<string> => {
  try {
    const res = await fetchData(`${getBasePath()}temp`, {
      method: 'POST',
      headers: {
        // https://github.com/airdcpp-web/airdcpp-webclient/issues/330
        'X-Authorization': LoginStore.authToken,
        
        'Authorization': LoginStore.authToken,
      },
      body: file
    });

    return res.headers.get('Location')!;
  } catch (e) {
    throw e;
  }
};

const toCorsSafeUrl = (url: string) => {
  const proxyUrl = `${window.location.origin}${getBasePath()}proxy?url=${encodeURIComponent(url)}`;
  return proxyUrl;
};

export const fetchCorsSafeData = async (url: string, isJSON: boolean, options?: RequestInit) => {
  try {
    //console.log(`CORS HTTP request started (${url})`);

    const res = await fetchData(
      toCorsSafeUrl(url), 
      {
        headers: {
          // https://github.com/airdcpp-web/airdcpp-webclient/issues/330
          'X-Authorization': LoginStore.authToken,

          // Temp workaround for people upgrading from versions < 2.7.0
          // If the new UI was loaded before restarting the app, a cache expiration time of 
          // one year would have been set for "Not found" errors...
          'Cache-Control': 'no-store, must-revalidate, max-age=0'
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
