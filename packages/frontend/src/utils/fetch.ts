interface CRUDParams {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url?: string;
  request?: string;
  credentials?: RequestCredentials;
}

/**
 * Simple encapsulated fetch method.
 *
 * @param {CRUDParams} params
 * @returns {Promise<Response>}
 */
export const crud = async (params: CRUDParams): Promise<Response> => {
  const { method, url = "", request, credentials } = params;
  const apiUrl =
    import.meta.env.VITE_BACKEND_URL + `/api/v1/mapping-data${url}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const body = request;

  return await fetch(apiUrl, {
    method,
    headers,
    body,
    credentials,
  });
};
