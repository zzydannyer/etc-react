export interface UserRoles {
  createBy?: string;
  lastUpdateBy?: string;
  userId?: number;
  roleId?: number;
  id?: number;
  createById?: number;
  lastUpdateById?: number;
}

export interface Item {
  children: Item[];
  createBy?: string;
  createTime?: string;
  lastUpdateBy?: string;
  lastUpdateTime?: string;
  name: string;
  createById?: number;
  delFlag?: number;
  id: number;
  lastUpdateById?: number;
  icon?: string;
  level?: number;
  orderNum?: number;
  parentId?: number;
  parentName?: string;
  perms?: string;
  type: number;
  url?: string;
}

export interface Result {
  total: number;
  list: Item[];
}

export interface SearchForm {
  name?: string;
}

export interface treeInterface {
  title: string;
  key: number;
  children: treeInterface[];
}

export interface AddForm {
  name: string;
  perms?: string;
  orderNum: number;
  icon?: string;
  url?: string;
  type: number;
  parentId?: number;
  id?: number;
}
