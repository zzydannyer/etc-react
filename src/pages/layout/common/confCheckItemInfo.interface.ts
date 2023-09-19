import type { Moment } from 'moment';

export interface ItemObj {
  newPassword: string;
  oldPassword: string;
}
export interface Item {
  sort: any;
  id: any;
  delFlag: number;
  checked: boolean;
}

export interface Result {
  total: number;
  list: ItemObj[];
}

export interface ItemObjDetil extends ItemObj {
  detial?: string;
}

export interface AddItem extends Omit<Partial<ItemObj>, 'firstOperationTime'> {
  [x: string]: any;
  firstOperationTime: Moment;
}
