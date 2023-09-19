import { extend } from 'umi-request';

export interface Result {
  total: number;
  list: TrainListInfo[];
}

export interface ItemObjDetil extends TrainListInfo {
  detial?: string;
}

export interface AddItem extends Omit<Partial<TrainListInfo>, ''> {}
