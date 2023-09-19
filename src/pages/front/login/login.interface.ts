export interface Item {
  orgName?: string | null;
  contactName?: string | null;
  developerName?: string | null;
  reviewStatusName?: string | null;
  batchCode?: string | null;
  reviewScheduleName?: string | null;
  reviewStatus?: string | null;
}

export interface Result {
  total: number;
  list: Item[];
}

export interface SearchForm {
  orgName: string;
  developerName: string;
  reviewStatus: string | number;
  batchCode: string | number;
  reviewSchedule: string;
}
