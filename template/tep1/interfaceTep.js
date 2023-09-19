// .eslintignore
const dirName = process.argv[2];
const interfaceTep = `
import type { Moment } from 'moment';

export interface ItemObj {
  /** xxx*/
  id: number;
  /** xxx*/
  name: string;
  /** xxx*/
  stationName: string;
  /** xxx*/
  stationSubName: string;
  /** xxx*/
  province: string;
  /** xxx*/
  city: string;
  /** xxx*/
  area: string;
  /** xxx*/
  address: string;
  /** xxx*/
  contact: string;
  /** xxx*/
  stationType: number;
  /** xxx*/
  contactEmail: string;
  /** xxx*/
  contactPhone: string;
  /** xxx*/
  remark: string;
  /** xxx*/
  firstOperationTime: string | Moment;
  /** xxx*/
  businessLicenseUrl: string;
  /** xxx*/
  createTime: string;
}

export interface Result {
  total: number;
  list: ItemObj[];
}

export interface ItemObjDetil extends ItemObj{
  detial?: string;
}

export interface AddItem extends Omit<Partial<ItemObj>,'firstOperationTime'> {
  firstOperationTime: Moment
}


`;
module.exports = interfaceTep;
