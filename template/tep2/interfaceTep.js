// .eslintignore
const dirName = process.argv[2];
const interfaceTep = `
import type { Moment } from 'moment';

export interface ItemObj {
  /** xxx*/
  id?: number;
  /** xxx*/
  name?: string | null;
  /** xxx*/
  stationName?: string | null;
  /** xxx*/
  stationSubName?: string;
  /** xxx*/
  province?: string;
  /** xxx*/
  city?: string;
  /** xxx*/
  area?: string;
  address?: string;
  contact?: string;
  stationType?: number;
  contactEmail?: string;
  contactPhone?: string;
  /** xxx*/
  remark?: string;
  /** xxx*/
  firstOperationTime?: string | Moment;
  /** xxx*/
  businessLicenseUrl?: string;
}

export interface Result {
  total: number;
  list: ItemObj[];
}

export interface SearchForm {
  stationName?: string;
  stationSubName?: number;
  date?: [Moment, Moment];
}

export interface ItemObjDetil extends ItemObj{
  detial?: string;
}

`;
module.exports = interfaceTep;
