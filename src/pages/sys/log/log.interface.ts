export interface Item {
  createBy: string;
  createById: null;
  createTime: string;
  delFlag: number;
  id: number;
  lastUpdateBy: string;
  lastUpdateById: number;
  lastUpdateTime: string;
  ip: string;
  method: string;
  operation: string;
  params: string;
  time: number;
  userName: string;
}

export interface Result {
  total: number;
  list: Item[];
}

export interface SearchForm {
  name?: string;
}
