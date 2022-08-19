export type Credentials = {
  email: string;
  password: string;
};

export type UserInfo = {
  permissions: string[];
  refreshToken: string;
  roles: string[];
  token: string;
  isAuthenticated?: boolean;
};

export type UserInfoByToken = {
  email: string;
  permissions: string[];
  roles: string[];
};
