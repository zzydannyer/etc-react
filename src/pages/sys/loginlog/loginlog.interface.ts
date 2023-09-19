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
  status: string;
  userName: string;
  time: number;
}

export interface Result {
  total: number;
  list: Item[];
}

export interface SearchForm {
  name?: string;
}
