import { AuthUser } from "@/type/auth";
import { EventType } from "@/type/event-type";
import { PaginatedResponse } from "@/type/paginated-response";
import { Field, Portal } from "@/type/portal";
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

  // Example functions
  public async getUserData(userId: number): Promise<any> {
    return this.request<any>(`/users/${userId}`);
  }

  public async postData(endpoint: string, data: any): Promise<any> {
    return this.request<any>(endpoint, "POST", {}, data);
  }

  //AUTHENTICATION
  public async login(data: any): Promise<AuthUser> {
    return this.unauthenticatedRequest<AuthUser>(
      apiUrls.auth.login,
      "POST",
      {},
      data
    );
  }

  //USERS
  public async getUsers(data: {
    page: number;
    size: number;
    portalId?: string;
  }): Promise<PaginatedResponse<User>> {
    const { page, size, portalId } = data;
    const params = new URLSearchParams();

    if (page) params.set("page", String(page));
    if (size) params.set("size", String(size));
    if (portalId) params.set("portalId", portalId);

    return this.request<PaginatedResponse<User>>(
      `${apiUrls.users.get}?${params.toString()}`
    );
  }

  public async postUser(data: UserPayload): Promise<User> {
    return this.request<User>(apiUrls.users.post, "POST", {}, data);
  }

  public async deleteUser(data: { userId: string }): Promise<void> {
    const { userId } = data;
    return this.request(`${apiUrls.users.delete}/${userId}`, "DELETE");
  }

  public async toggleUserAccess(data: { userId: string }): Promise<void> {
    const { userId } = data;
    const url = apiUrls.users.toggleAccess(userId);
    return this.request(url, "PUT");
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

  public async getPortalTemplates(): Promise<Portal[]> {
    return this.request<Portal[]>(apiUrls.portalsManagement.getPortalTemplates);
  }

  public async getPortalDetails(portalId: string): Promise<Portal> {
    return this.request<Portal>(
      apiUrls.portalsManagement.getPortalDetails(portalId)
    );
  }

  public async addPortalToEvent(
    eventId: string,
    templateId: string
  ): Promise<void> {
    const url = apiUrls.portalsManagement.addPortalToEvent(eventId);
    return this.request<void>(`${url}?templateId=${templateId}`, "PUT");
  }

  public async removePortalFromEvent(portalId: string): Promise<void> {
    return this.request<void>(
      apiUrls.portalsManagement.removePortalFromEvent(portalId),
      "DELETE"
    );
  }

  public async updateCustomFields(
    portalId: string,
    scope: "SESSION_IMPORT" | "PRESENTATION_IMPORT",
    customFields: Field[]
  ): Promise<void> {
    const params = new URLSearchParams();
    params.set("scope", scope);
    return this.request<void>(
      `${apiUrls.portalsManagement.updateCustomFields(
        portalId
      )}?${params.toString()}`,
      "POST",
      {},
      customFields
    );
  }

  public async uploadAndCreateJob(
    portalId: string,
    purpose:
      | "IMPORT_SESSIONS"
      | "IMPORT_PRESENTATIONS"
      | "EXPORT_SESSIONS"
      | "EXPORT_PRESENTATIONS",
    file: File
  ): Promise<void> {
    const params = new URLSearchParams();
    params.set("purpose", purpose);
    const formData = new FormData();
    formData.append("file", file);
    return this.request<void>(
      apiUrls.files.uploadAndCreateJob(portalId) + "?" + params.toString(),
      "POST",
      {},
      formData
    );
  }

  public async getJobs(portalId: string): Promise<PaginatedResponse<Job>> {
    return this.request<PaginatedResponse<Job>>(apiUrls.files.jobs(portalId));
  }
}

export default ApiClient;
