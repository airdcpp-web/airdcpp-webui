import { Dupe, FileItemType, HintedUser, IP } from './common';

export interface SearchResponse {
  queue_time: number;
  search_id: number;
  queued_count: number;
}

export interface GroupedSearchResult {
  id: string;
  name: string;
  relevance: number;
  hits: number;
  users: SearchResultUserInfo;
  type: FileItemType;
  path: string;
  tth: string;
  dupe: Dupe;
  time: number;
  slots: SlotCount;
  connection: number;
  size: number;
}

export interface ChildSearchResult {
  id: number;
  path: string;
  user: HintedUser;
  slots: SlotCount;
  time: number;
  connection: number;
  ip: IP;
}

export interface SearchResultUserInfo {
  count: number;
  user: HintedUser;
}

export interface SlotCount {
  free: number;
  total: number;
  str: string;
}
