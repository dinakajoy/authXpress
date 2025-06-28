export interface IRole {
  _id?: string;
  label: string;
  description?: string;
  permission: string[] | IPermission[];
}

export interface IRoleWithPermission {
  _id: string;
  label: string;
  description?: string;
  permission: IPermission[];
}

export interface IPermission {
  _id?: string;
  name: string;
  description: string;
  group: string;
}