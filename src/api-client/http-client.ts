import { AuthUser } from "@/type/auth";

export default class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getUserInfo(): AuthUser {
    const userFromStorage = localStorage.getItem("user") ?? "";
    if (userFromStorage) {
      return JSON.parse(userFromStorage);
    }
    return {
      token: "",
      expiresIn: 0,
      expired: true,
    };
  }

  public async request<T>(
    endpoint: string,
    method: string = "GET",
    headers: Record<string, string> = {},
    body: any = null
  ): Promise<T> {
    // const token = this.getBearerToken();

    const { token } = this.getUserInfo();

    const defaultHeaders: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...headers,
    };

    const options: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      const responseJson = await response.json();
      throw new Error(responseJson.message);
    }
    if (method === "DELETE") {
      return response as T;
    }
    return await response.json();
  }

  public async multiPartRequest<T>(
    endpoint: string,
    method: string = "GET",
    headers: Record<string, string> = {},
    body: any = null
  ): Promise<T> {
    const { token } = this.getUserInfo();

    const defaultHeaders: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      ...headers,
    };

    const options: RequestInit = {
      method,
      headers: defaultHeaders,
      body,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    if (!response.ok) {
      const responseJson = await response.json();
      throw new Error(JSON.stringify(responseJson));
    }
    if (method === "DELETE") {
      return response as T;
    }
    return await response.json();
  }

  public async unauthenticatedRequest<T>(
    endpoint: string,
    method: string = "GET",
    headers: Record<string, string> = {},
    body: any = null
  ): Promise<T> {
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    const options: RequestInit = {
      method,
      headers: defaultHeaders,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, options);

    if (!response.ok) {
      const responseJson = await response.json();
      throw new Error(responseJson.message);
    }
    if (method === "DELETE") {
      return response as T;
    }
    return await response.json();
  }
}
