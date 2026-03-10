// features/auth/domain/types.ts
export type UserCredentials = {
  email: string;
  password: string;
};

export type AuthResult =
  | { success: true; userId: number }
  | { success: false; error: "invalid_credentials" | "email_not_found" | "unexpected" };

export type SignUpData = {
  name: string;
  email: string;
  password: string;
};