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

export class QueryUserInput {
  relations?: string[] | any;
}
