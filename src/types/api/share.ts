import { DirectoryType, FileType } from './common';
import { ShareProfileBasic } from './shareprofiles';

export const enum ShareRootStatusEnum {
  NORMAL = 'normal',
  REFRESH_PENDING = 'refresh_pending',
  REFRESH_RUNNING = 'refresh_running',
}

export interface ShareRootStatus {
  id: ShareRootStatusEnum;
  str: string;
}

export interface ShareRootEntryBase {
  id: string;
  virtual_name: string;
  path: string;
  incoming: boolean;
}

export type ShareRootEntry = ShareRootEntryBase & {
  type: DirectoryType;
  status: ShareRootStatus;
  profiles: ShareProfileBasic[];
  size: number;
  last_refresh_time: number;
};

export interface TempShareItem {
  id: string;
  name: string;
  path: string;
  size: number;
  tth: string;
  time_added: number;
  type: FileType;
}
