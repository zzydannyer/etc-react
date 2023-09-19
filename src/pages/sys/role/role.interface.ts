export interface Result {
  total: number;
  list: RoleObj[];
}
export interface SearchForm {
  roleName?: string;
}

export interface ChangeRole {
  roleName: string;
  remark: string;
}
