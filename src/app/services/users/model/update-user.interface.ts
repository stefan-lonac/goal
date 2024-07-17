export interface UpdateUserResponse {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: Array<number>;
}
