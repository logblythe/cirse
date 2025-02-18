import { AuthUser } from "@/type/auth";
import { EventType } from "@/type/event-type";
import { PaginatedResponse } from "@/type/paginated-response";
import { Portal } from "@/type/portal";
import { User, UserPayload } from "@/type/user";
import { apiUrls } from "./apiUrls";

class ApiClient {
  private baseUrl: string =
    "https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1";

  // private baseUrl: string = "http://localhost:8080";

  private getBearerToken(): string {
    return "YOUR_BEARER_TOKEN";
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

  // Example functions
  public async getUserData(userId: number): Promise<any> {
    return this.request<any>(`/users/${userId}`);
  }

  public async postData(endpoint: string, data: any): Promise<any> {
    return this.request<any>(endpoint, "POST", {}, data);
  }

  //AUTHENTICATION
  public async login(data: any): Promise<AuthUser> {
    return this.request<AuthUser>(apiUrls.auth.login, "POST", {}, data);
  }

  //USERS
  public async getUsers(data: {
    page: number;
    size: number;
  }): Promise<PaginatedResponse<User>> {
    const { page, size } = data;

    return this.request<PaginatedResponse<User>>(
      `${apiUrls.users.get}?page=${page}&size=${size}`
    );
  }

  public async postUser(data: UserPayload): Promise<User> {
    return this.request<User>(apiUrls.users.post, "POST", {}, data);
  }

  public async deleteUser(data: { userId: string }): Promise<void> {
    const { userId } = data;
    return this.request(`${apiUrls.users.delete}/${userId}`, "DELETE");
  }

  public async changePassword(data: {
    userId: string;
    newPassword: string;
  }): Promise<User> {
    const { newPassword, userId } = data;
    return this.request<User>(
      `${apiUrls.users.changePassword}?newPassword=${newPassword}&userId=${userId}`,
      "PUT"
    );
  }

  //EVENTS
  public async getEvents(): Promise<EventType[]> {
    return this.request<EventType[]>(apiUrls.events.get);
  }

  public async deleteEventById(eventId: string): Promise<EventType[]> {
    return this.request<EventType[]>(
      apiUrls.events.deleteEventById(eventId),
      "DELETE"
    );
  }

  public async getSwoogoEvents(): Promise<
    { eventId: string; eventName: string }[]
  > {
    return this.request<{ eventId: string; eventName: string }[]>(
      apiUrls.events.getSwoogoEvents
    );
  }

  public async saveEvent(
    payload: any,
    method: "POST" | "PUT"
  ): Promise<EventType> {
    return this.request(apiUrls.events.saveEvent, method, {}, payload);
  }

  //PORTALS MANAGEMENT
  public async getEventPortals(eventId: string): Promise<Portal[]> {
    return this.request<Portal[]>(
      apiUrls.portalsManagement.getEventPortals(eventId)
    );
  }
}

export default ApiClient;
