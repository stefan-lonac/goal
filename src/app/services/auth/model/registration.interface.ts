export interface RegistrationResponse {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: Array<number>;
}
