export interface Item {
  createBy: string;
  createById: null;
  createTime: string;
  delFlag: number;
  description: string;
  id: number;
  label: string;
  lastUpdateBy: string;
  lastUpdateById: number;
  lastUpdateTime: string;
  remarks: string;
  sort: number;
  type: string;
  value: string;
}

export interface Result {
  total: number;
  list: Item[];
}

export interface SearchForm {
  name?: string;
}

export interface ChangeDict {
  label: string;
  remarks: string;
  delFlag: number;
  description: string;
  id: number;
  sort: number;
  type: string;
  value: string;
}
