declare namespace API {
  interface QueueSource {
    user: HintedUser;
    last_speed: number;
  }

  interface QueueBundleSource extends QueueSource {
    files: number;
    size: number;
  }

  enum QueuePriorityId {
    PAUSED_FORCED = -1,
    PAUSED = 0,
    LOWEST = 1,
    LOW = 2,
    NORMAL = 3,
    HIGH = 4,
    HIGHEST = 5,
  }

  export interface QueuePriority {
    id: QueuePriorityId;
    str: string;
    auto: boolean;
  }

  export enum QueueBundleStatusId {
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

  export interface QueueBundleStatus {
    id: QueueBundleStatusId;
    failed: boolean;
    downloaded: boolean;
    completed: boolean;
    str: string;
    hook_error: HookError;
  }

  export interface QueueFileStatus {
    str: string;
    downloaded: boolean;
    completed: boolean;
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

  export interface QueueFile extends QueueItemBase {
    id: number;
    name: string;
    target: string;
    type: FileItemType;
    bundle: number;
    status: QueueFileStatus;
    tth: string;
  }

  export interface QueueBundle extends QueueItemBase {
    id: number;
    name: string;
    target: string;
    type: API.FileItemType;
    status: QueueBundleStatus;

    //id: 'normal' | 'refresh_pending' | 'refresh_running';
    //str: string;
  }
}
