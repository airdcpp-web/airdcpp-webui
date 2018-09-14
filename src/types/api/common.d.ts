declare namespace API {
  export type IdType = number | string;

  // FILES
  export type FileContentType = 'audio' | 'compressed' | 'document' | 'executable' | 'picture' | 'video' | 'other' | 'filelist';

  export interface DirectoryType {
    id: 'directory';
    str: string;
    files: number;
    directories: number;
  }

  export interface FileType {
    id: 'file';
    str: string;
    content_type: FileContentType;
  }

  export type FileItemType = FileType | DirectoryType;


  // LOCAL FILES
  export interface DriveType {
    id: 'drive_fixed' | 'drive_remote' | 'removable',
  }

  export type FilesystemItemType = FileItemType | DriveType;

  export interface GroupedPath {
    name: string;
    paths: string[];
  }


  // PROTOCOL FILES
  type DupeId = 'share_partial' | 'share_full' | 'queue_partial' | 'queue_full' | 'finished_partial' | 'finished_full' | 'share_full';

  interface Dupe {
    id: DupeId;
    paths: string[];
  }

  interface FileItemInfo {
    path: string;
    dupe: Dupe;
    name: string;
    type: FileItemType;
  }


  // MESSAGES
  export interface ChatMessageCounts {
    total: number;
    unread: UnreadChatMessageCounts;
  }

  export interface StatusMessageCounts {
    total: number;
    unread: UnreadStatusMessageCounts;
  }

  export interface UnreadChatMessageCounts {
    user: number;
    bot: number;
    status: number;
  }

  export interface UnreadStatusMessageCounts {
    info: number;
    warning: number;
    error: number;
  }

  export interface ReadableSessionItem {
    read: boolean;
  }
  
  export interface MessageSessionItem {
    message_counts: API.ChatMessageCounts | API.StatusMessageCounts;
  }

  export enum Severity {
    NOTIFY = 'notify',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
  }

  export interface Message {
    id: number;
    time: number;
    text: string;
    is_read: boolean;
  }

  export interface ChatMessage extends Message {
    third_person: boolean;
    from: HubUser;
    reply_to?: HubUser;
    to?: HubUser;
  }

  export interface StatusMessage extends Message {
    severity: Severity;
    is_read: boolean;
  }
  
  export interface MessageListItem {
    chat_message?: ChatMessage;
    log_message?: StatusMessage;
  }


  // ENCRYPTION
  export interface EncryptionInfo {
    str: string;
    trusted: boolean;
  }

  export interface IP {
    country: string;
    ip: string;
    str: string;
  }

  
  // USERS
  export type UserFlag = 'self' | 'bot' | 'asch' | 'ccpm' | 'ignored' | 'favorite' | 'nmdc' | 'offline' | 'op';

  export type HubUserFlag = UserFlag | 'away' | 'op' | 'hidden' | 'noconnect' | 'passive';

  export interface User {
    cid: string;
    nicks: string;
    hub_names: string;
    hub_urls: string[];
    flags: UserFlag[];
  }

  interface HintedUserBase {
    cid: string;
    hub_url: string;
  }

  interface HintedUser extends HintedUserBase {
    nicks: string;
    hub_names: string;
    flags: HubUserFlag[];
  }

  interface HubUser extends HintedUserBase {
    hub_name: string;
    flags: HubUserFlag[];
    ip4?: IP;
    ip6?: IP;
    nick: string;
    description?: string;
    email?: string;
    tag: string;
    share_size: number;
    upload_speed: number;
    download_speed: number;
    file_count: number;
  }


  // POST data
  interface DownloadData {
    target_name: string;
    target_directory: string;
    priority: number;
  }

  // MISC
  interface HookError {
    hook_id: string;
    hook_name: string;
    error_id: string;
    str: string;
  }

  enum Priority {
    LOWEST = 1,
    LOW = 2,
    NORMAL = 3,
    HIGH = 4,
    HIGHEST = 5,
  }

  enum DownloadableItemStateId {
    DOWNLOAD_FAILED = 'download_failed',
    DOWNLOAD_PENDING = 'download_pending',
    DOWNLOADING = 'downloading',
    LOADING = 'loading',
    DOWNLOADED = 'downloaded',
  }

  interface DownloadableItemState {
    id: DownloadableItemStateId;
    str: string;
    time_finished: number;
  }

  export enum AccessId {
    ADMIN = 'admin',
  
    SEARCH = 'search',
    DOWNLOAD = 'download',
    TRANSFERS = 'transfers',
  
    EVENTS_VIEW = 'events_view',
    EVENTS_EDIT = 'events_edit',
  
    QUEUE_VIEW = 'queue_view',
    QUEUE_EDIT = 'queue_edit',
  
    FAVORITE_HUBS_VIEW = 'favorite_hubs_view',
    FAVORITE_HUBS_EDIT = 'favorite_hubs_edit',
  
    SETTINGS_VIEW = 'settings_view',
    SETTINGS_EDIT = 'settings_edit',
  
    FILESYSTEM_VIEW = 'filesystem_view',
    FILESYSTEM_EDIT = 'filesystem_edit',
  
    HUBS_VIEW = 'hubs_view',
    HUBS_EDIT = 'hubs_edit',
    HUBS_SEND = 'hubs_send',
  
    PRIVATE_CHAT_VIEW = 'private_chat_view',
    PRIVATE_CHAT_EDIT = 'private_chat_edit',
    PRIVATE_CHAT_SEND = 'private_chat_send',
  
    FILELISTS_VIEW = 'filelists_view',
    FILELISTS_EDIT = 'filelists_edit',
  
    VIEW_FILE_VIEW = 'view_file_view',
    VIEW_FILE_EDIT = 'view_file_edit',
  }
}