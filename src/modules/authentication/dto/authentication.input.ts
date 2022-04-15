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

export class RefreshTokenInput {
  refreshToken?: string;
}

export class UpdateUserInfoInput {
  profileImage?: string;
  bio?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
}

export class UpdateUserSocialNetwork {
  type?: string;
  displayNameSocial?: string;
  linkSocialNetwork?: string;
}