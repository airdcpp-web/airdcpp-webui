declare namespace API {
  interface QueueSource {
    user: HintedUser;
    last_speed: number;
  }

  enum QueuePriority {
    PAUSED_FORCED = -1,
    PAUSED = 0,
    LOWEST = 1,
    LOW = 2,
    NORMAL = 3,
    HIGH = 4,
    HIGHEST = 5,
  }

  export enum BundleStatusId {
    NEW = 'new',
    QUEUED = 'queued',
    DOWNLOAD_ERROR = 'download_error',
    RECHECK = 'recheck',
    DOWNLOADED = 'downloaded',
    COMPLETION_VALIDATION_RUNNING = 'completion_validation_running',
    COMPLETION_VALIDATION_ERROR = 'completion_validation_error',
    COMPLETED = 'completed',
    SHARED = 'shared',
  }

  export interface BundleStatus {
    id: BundleStatusId;
    failed: boolean;
    downloaded: boolean;
    completed: boolean;
    str: string;
    hook_error: HookError;
  }

  export interface QueueItemBase {
    size: number;
    downloaded_bytes: number;
    priority: QueuePriority;
    time_added: number;
    time_finished: number;
    speed: number;
    seconds_left: number;
    sources: QueueSource;
  }

  export interface Bundle {
    id: number;
    name: string;
    target: string;
    type: API.FileItemType;
    status: BundleStatus;

    //id: 'normal' | 'refresh_pending' | 'refresh_running';
    //str: string;
  }
}
