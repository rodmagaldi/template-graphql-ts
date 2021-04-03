export interface SignUpInputModel {
  cpf: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
export interface LoginInputModel {
  cpf: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginModel {
  token: string;
}
