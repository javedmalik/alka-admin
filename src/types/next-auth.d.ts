import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      roleName: string;
      roleCode: string;
      isActive: boolean;
    };
  }

  interface User {
    id: string;
    roleName: string;
    roleCode: string;
    isActive: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    roleName?: string;
    roleCode?: string;
    isActive?: boolean;
  }
}