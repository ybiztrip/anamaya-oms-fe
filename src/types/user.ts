export type RoleType = {
  id: number;
  name: string;
  code: string;
};

export type UserRoleType = {
  id: number;
  roleId: number;
  roleName: string;
  roleCode: string;
};

export type UserType = {
  id: number;
  companyId: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  positionId: number;
  countryCode: string;
  phoneNo: string;
  title: string;
  identityNo: string;
  passportNo: string;
  passportExpiry: string;
  dateOfBirth: string;
  nationality: string;
  status: number;
  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
  password?: string;
  enableChatEngine?: boolean;
  roles?: UserRoleType[];
};

export type UserListPayloadType = {
  page: number;
  size: number;
  email: string;
  sort?: string;
};

export type UserRolesUpsertPayloadType = {
  roleId: number;
  isDelete: boolean;
}[];

export type UserUpdatePasswordPayloadType = {
  oldPassword: string;
  newPassword: string;
};
