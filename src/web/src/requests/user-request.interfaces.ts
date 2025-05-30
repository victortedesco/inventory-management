export interface CreateUserRequest {
  userName: string;
  displayName: string;
  email: string;
  cpf: string;
  password: string;
  role: string ;
}

export interface UpdateUserRequest {
  id: string;
  userName: string;
  displayName: string;
  email: string;
  password?: string;
  role: string ;
}
