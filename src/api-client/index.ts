import { AuthUser } from "@/type/auth";
import { EventType } from "@/type/event-type";
import { Job } from "@/type/job";
import { PaginatedResponse } from "@/type/paginated-response";
import { ExtractField, Field, Portal } from "@/type/portal";
import { EXPORT_PURPOSE, IMPORT_PURPOSE } from "@/type/purpose";
import { User, UserPayload, UserRole } from "@/type/user";
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
    roleFilter: UserRole;
  }): Promise<PaginatedResponse<User>> {
    const { page, size, portalId, roleFilter } = data;
    const params = new URLSearchParams();

    if (page) params.set("page", String(page));
    if (size) params.set("size", String(size));
    if (portalId) params.set("portalId", portalId);
    if (roleFilter) params.set("roleFilter", roleFilter);

    return this.httpClient.request<PaginatedResponse<User>>(
      `${apiUrls.users.get}?${params.toString()}`
    );
  }

  public async getMe(): Promise<User> {
    return this.httpClient.request<User>(apiUrls.users.me);
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

  public async getAllEvents(): Promise<EventType[]> {
    return this.httpClient.request<EventType[]>(
      apiUrls.events.getEventDefinitions
    );
  }

  public async importEvent(payload: EventType): Promise<void> {
    return this.httpClient.request<void>(
      apiUrls.events.importEvent,
      "POST",
      {},
      payload
    );
  }

  public async deleteEventById(eventId: string): Promise<EventType[]> {
    return this.httpClient.request<EventType[]>(
      apiUrls.events.deleteEventById(eventId),
      "DELETE"
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

  public async updateExtractFields(
    portalId: string,
    scope: "SESSION_IMPORT" | "PRESENTATION_IMPORT",
    extractFields: ExtractField[]
  ): Promise<void> {
    const params = new URLSearchParams();
    params.set("scope", scope);
    return this.httpClient.request<void>(
      `${apiUrls.portalsManagement.updateExtractionFields(
        portalId
      )}?${params.toString()}`,
      "POST",
      {},
      extractFields
    );
  }

  public async createDataExtractionJob(
    portalId: string,
    purpose: EXPORT_PURPOSE,
    formData: any
  ): Promise<void> {
    const params = new URLSearchParams();
    params.set("purpose", purpose);
    const url = apiUrls.files.jobs(portalId) + "?" + params.toString();
    return this.httpClient.request<void>(String(url), "POST", {}, formData);
  }

  public async uploadAndCreateJob(
    portalId: string,
    purpose: IMPORT_PURPOSE,
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

  public async getJobs(
    portalId: string,
    page: number = 0,
    size: number = 50
  ): Promise<PaginatedResponse<Job>> {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("size", String(size));
    const url = apiUrls.files.jobs(portalId) + "?" + params.toString();
    return this.httpClient.request<PaginatedResponse<Job>>(url);
  }

  public async downloadExtractedFile(jobId: string): Promise<void> {
    return this.httpClient.downloadRequest(apiUrls.files.download(jobId));
  }
}

export default ApiClient;
