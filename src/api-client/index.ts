import { AuthUser } from "@/type/auth";
import { EventType } from "@/type/event-type";
import { Job } from "@/type/job";
import { PaginatedResponse } from "@/type/paginated-response";
import { Field, Portal } from "@/type/portal";
import { User, UserPayload } from "@/type/user";
import { apiUrls } from "./apiUrls";
import HttpClient from "./http-client";

class ApiClient {
  private baseUrl: string =
    "https://cirse-portals-83faa4ddee7c.herokuapp.com/api/v1";

  // private baseUrl: string = "http://localhost:8080";

  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(this.baseUrl);
  }

  // Example functions
  public async getUserData(userId: number): Promise<any> {
    return this.httpClient.request<any>(`/users/${userId}`);
  }

  public async postData(endpoint: string, data: any): Promise<any> {
    return this.httpClient.request<any>(endpoint, "POST", {}, data);
  }

  //AUTHENTICATION
  public async login(data: any): Promise<AuthUser> {
    return this.httpClient.unauthenticatedRequest<AuthUser>(
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

    return this.httpClient.request<PaginatedResponse<User>>(
      `${apiUrls.users.get}?${params.toString()}`
    );
  }

  public async postUser(data: UserPayload): Promise<User> {
    return this.httpClient.request<User>(apiUrls.users.post, "POST", {}, data);
  }

  public async deleteUser(data: { userId: string }): Promise<void> {
    const { userId } = data;
    return this.httpClient.request(
      `${apiUrls.users.delete}/${userId}`,
      "DELETE"
    );
  }

  public async toggleUserAccess(data: { userId: string }): Promise<void> {
    const { userId } = data;
    const url = apiUrls.users.toggleAccess(userId);
    return this.httpClient.request(url, "PUT");
  }

  public async changePassword(data: {
    userId: string;
    newPassword: string;
  }): Promise<User> {
    const { newPassword, userId } = data;
    return this.httpClient.request<User>(
      `${apiUrls.users.changePassword}?newPassword=${newPassword}&userId=${userId}`,
      "PUT"
    );
  }

  //EVENTS
  public async getEvents(): Promise<EventType[]> {
    return this.httpClient.request<EventType[]>(apiUrls.events.get);
  }

  public async deleteEventById(eventId: string): Promise<EventType[]> {
    return this.httpClient.request<EventType[]>(
      apiUrls.events.deleteEventById(eventId),
      "DELETE"
    );
  }

  public async getSwoogoEvents(): Promise<
    { eventId: string; eventName: string }[]
  > {
    return this.httpClient.request<{ eventId: string; eventName: string }[]>(
      apiUrls.events.getSwoogoEvents
    );
  }

  public async saveEvent(
    payload: any,
    method: "POST" | "PUT"
  ): Promise<EventType> {
    return this.httpClient.request(
      apiUrls.events.saveEvent,
      method,
      {},
      payload
    );
  }

  //PORTALS MANAGEMENT
  public async getEventPortals(eventId: string): Promise<Portal[]> {
    return this.httpClient.request<Portal[]>(
      apiUrls.portalsManagement.getEventPortals(eventId)
    );
  }

  public async getPortalTemplates(): Promise<Portal[]> {
    return this.httpClient.request<Portal[]>(
      apiUrls.portalsManagement.getPortalTemplates
    );
  }

  public async getPortalDetails(portalId: string): Promise<Portal> {
    return this.httpClient.request<Portal>(
      apiUrls.portalsManagement.getPortalDetails(portalId)
    );
  }

  public async addPortalToEvent(
    eventId: string,
    templateId: string
  ): Promise<void> {
    const url = apiUrls.portalsManagement.addPortalToEvent(eventId);
    return this.httpClient.request<void>(
      `${url}?templateId=${templateId}`,
      "PUT"
    );
  }

  public async removePortalFromEvent(portalId: string): Promise<void> {
    return this.httpClient.request<void>(
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
    return this.httpClient.request<void>(
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
    const url =
      apiUrls.files.uploadAndCreateJob(portalId) + "?" + params.toString();
    const formData = new FormData();
    formData.append("file", file);
    return this.httpClient.multiPartRequest<void>(url, "POST", {}, formData);
  }

  public async getJobs(portalId: string): Promise<PaginatedResponse<Job>> {
    return this.httpClient.request<PaginatedResponse<Job>>(
      apiUrls.files.jobs(portalId)
    );
  }
}

export default ApiClient;
