declare namespace API {
  export interface TransferStats {
    speed_down: number;
    speed_up: number;
    downloads: number;
    uploads: number;
    session_downloaded: number;
    session_uploaded: number;
    limit_up: number;
    limit_down: number;
  }

  export enum TransferStatusId {
    WAITING = 'waiting',
    FINISHED = 'finished',
    RUNNING = 'running',
    FAILED = 'failed',
  }

  export interface TransferStatus {
    id: TransferStatusId;
    str: string;
    finished: boolean;
  }

  export interface Transfer {
    id: number;
    name: string;
    target: string;
    download: boolean;
    type: FileItemType;
    size: number;
    bytes_transferred: number;
    time_started: number;
    speed: number;
    seconds_left: number; 
    encryption: EncryptionInfo;
    ip: IP;
    user: HintedUser;
    status: TransferStatus;
    tth: string;
    flags: string[];
    queue_file_id: number;
  }
}