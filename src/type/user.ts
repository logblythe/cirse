export type UserRole = "ADMIN" | "SU_ADMIN" | "PORTAL";

export type User = {
  id: string;
  email: string;
  enabled: boolean;
  roles: Array<UserRole>;
};

export type UserPayload = {
  email: string;
  password: string;
} & ({ role: "PORTAL"; portalId: string } | { role: "ADMIN" | "SU_ADMIN" });
