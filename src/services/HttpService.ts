import { fetchData } from '@/utils/HttpUtils';

import * as UI from '@/types/ui';

const getAuthHeaders = (session: UI.AuthenticatedSession) => {
  const token = `${session.token_type} ${session.auth_token}`;
  return {
    // Don't send the standard Authorization header due to proxy compatibility, see
    // https://github.com/airdcpp-web/airdcpp-webclient/issues/330
    'X-Authorization': token,
  };
};

export const uploadTempFile = async (
  file: File,
  session: UI.AuthenticatedSession,
): Promise<string> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await fetchData(`${getBasePath()}temp`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(session),
        'X-File-Name': file.name,
      },
      body: file,
    });

    return res.headers.get('Location')!;
  } catch (e) {
    throw e;
  }
};

const toCorsSafeUrl = (url: string) => {
  const proxyUrl = `${
    window.location.origin
  }${getBasePath()}proxy?url=${encodeURIComponent(url)}`;
  return proxyUrl;
};

interface FetchDataOptions extends RequestInit {
  isJSON?: boolean;
}

const DefaultFetchOptions: FetchDataOptions = {
  isJSON: true,
};

export const fetchCorsSafeData = async (
  url: string,
  session: UI.AuthenticatedSession,
  options: FetchDataOptions = DefaultFetchOptions,
) => {
  try {
    //console.log(`CORS HTTP request started (${url})`);

    const res = await fetchData(toCorsSafeUrl(url), {
      headers: {
        ...getAuthHeaders(session),

        // Temp workaround for people upgrading from versions < 2.7.0
        // If the new UI was loaded before restarting the app, a cache expiration time of
        // one year would have been set for "Not found" errors...
        'Cache-Control': 'no-store, must-revalidate, max-age=0',
      },
      ...options,
    });

    const data = await (options.isJSON ? res.json() : res.text());
    return data;
  } catch (e) {
    console.error(`CORS HTTP request failed (${url})`, e);
    throw e;
  }
};
