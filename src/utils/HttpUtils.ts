class HTTPError extends Error {
  constructor(code: number, status: string) {
    super(`${status} (code ${code})`);

    this.status = status;
    this.code = code;
  }

  public status: string;
  public code: number;
}

export const fetchData = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new HTTPError(res.status, res.statusText);
  }

  return res;
};
