export class LoginInput {
  id?: number;
  userName?: string;
  password?: string;
}

export class LoginNormalField {
  accessToken: string;
  refreshToken: string;
  expireTime?: number;
}
