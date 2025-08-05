import { DirectoryType, FileType, User } from './common';
import { ShareProfileBasic } from './shareprofiles';

export const enum ShareRootStatusEnum {
  NORMAL = 'normal',
  REFRESH_PENDING = 'refresh_pending',
  REFRESH_RUNNING = 'refresh_running',
}

export const enum RefreshPriorityTypeEnum {
  NORMAL = 'normal',
  MANUAL = 'manual',
  SCHEDULED = 'scheduled',
  BLOCKING = 'blocking',
}

export const enum RefreshTypeEnum {
  ADD_BUNDLE = 'add_bundle',
  ADD_DIRECTORY = 'add_directory',
  REFRESH_ALL = 'refresh_all',
  REFRESH_INCOMING = 'refresh_incoming',
  REFRESH_DIRECTORIES = 'refresh_directories',
}

export const enum RefreshQueueResultEnum {
  STARTED = 'started',
  QUEUED = 'queued',
  EXISTS = 'exists',
}

export interface ShareRootStatus {
  id: ShareRootStatusEnum;
  str: string;
  refresh_task_id: number | null;
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
  id: number;
  name: string;
  path: string;
  size: number;
  tth: string;
  time_added: number;
  type: FileType;
  user: User | null;
}

export interface ShareRefreshTask {
  id: number;
  type: RefreshTypeEnum;
  priority_type: RefreshPriorityTypeEnum;
  real_paths: string[];
  running: boolean;
  canceled: boolean;
}

export interface ShareRefreshQueueResult {
  task: { id: number } | null;
  result: RefreshQueueResultEnum;
}
