import { FileItemType, EncryptionInfo, HintedUser, IP } from './common';

export interface TransferStats {
  speed_down: number;
  speed_up: number;
  downloads: number;
  uploads: number;
  session_downloaded: number;
  session_uploaded: number;
  limit_up: number;
  limit_down: number;
  queued_bytes: number;
}

export const enum TransferStatusEnum {
  WAITING = 'waiting',
  FINISHED = 'finished',
  RUNNING = 'running',
  FAILED = 'failed',
}

export interface TransferStatus {
  id: TransferStatusEnum;
  str: string;
  finished: boolean;
}

export interface Transfer {
  id: number;
  name: string;
  target: string;
  download: boolean;
  type: FileItemType | null;
  size: number;
  bytes_transferred: number;
  time_started: number;
  speed: number;
  seconds_left: number; 
  encryption: EncryptionInfo | null;
  ip: IP;
  user: HintedUser;
  status: TransferStatus;
  tth: string;
  flags: string[];
  queue_file_id: number;
}