export interface UsersResponse {
  id: number;
  name: string;
  email: string;
  password: string;
  salt: string;
  accountConfirmed: boolean;
}
