export type IdType = number | string;

// FILES
export type FileContentType =
  | 'audio'
  | 'compressed'
  | 'document'
  | 'executable'
  | 'picture'
  | 'video'
  | 'other'
  | 'filelist';

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
  id: 'drive_fixed' | 'drive_remote' | 'removable';
}

export type FilesystemItemType = FileItemType | DriveType;

export interface GroupedPath {
  name: string;
  paths: string[];
}

// PROTOCOL FILES
export const enum DupeEnum {
  SHARE_PARTIAL = 'share_partial',
  SHARE_FULL = 'share_full',
  QUEUE_PARTIAL = 'queue_partial',
  QUEUE_FULL = 'queue_full',
  FINISHED_PARTIAL = 'finished_partial',
  FINISHED_FULL = 'finished_full',
  SHARE_QUEUE = 'share_queue',
  QUEUE_FINISHED = 'queue_finished',
  SHARE_FINISHED = 'share_finished',
  SHARE_QUEUE_FINISHED = 'share_queue_finished',
}

export interface Dupe {
  id: DupeEnum;
  paths: string[];
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
  mention: number;
  status: number;
  verbose: number;
}

export interface UnreadStatusMessageCounts {
  info: number;
  warning: number;
  error: number;
  verbose: number;
}

export const enum SeverityEnum {
  NOTIFY = 'notify',
  VERBOSE = 'verbose',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export const enum MessageHighlightTypeEnum {
  LINK_URL = 'link_url',
  LINK_TEXT = 'link_text',
  USER = 'user',
  BOLD = 'bold',
}

export const enum StatusMessageTypeEnum {
  PRIVATE = 'private',
  SERVER = 'server',
  SYSTEM = 'system',
  SPAM = 'spam',
  HISTORY = 'history',
}

export interface MessageHighlight {
  id: number;
  text: string;
  position: {
    start: number;
    end: number;
  };
  type: MessageHighlightTypeEnum;
  tag: string;
  dupe: Dupe | null;
  content_type: FileContentType | null;
}

export interface MessageBase {
  id: number;
  time: number;
  text: string;
  is_read: boolean;
  highlights: MessageHighlight[];
}

export type Message = ChatMessage | StatusMessage;

export interface ChatMessage extends MessageBase {
  third_person: boolean;
  from: HubUser;
  reply_to?: HubUser;
  to?: HubUser;
  has_mention: boolean;
}

export interface StatusMessage extends MessageBase {
  severity: SeverityEnum;
  is_read: boolean;
  label?: string;
  type: StatusMessageTypeEnum;
}

export interface OutgoingChatMessage {
  text: string;
  third_person?: boolean;
}

export interface OutgoingChatStatusMessage {
  text: string;
  severity: SeverityEnum;
  type: StatusMessageTypeEnum;
  owner?: string;
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
export type UserFlag =
  | 'self'
  | 'bot'
  | 'asch'
  | 'ccpm'
  | 'ignored'
  | 'favorite'
  | 'nmdc'
  | 'offline'
  | 'op';

export type HubUserFlag = UserFlag | 'away' | 'op' | 'hidden' | 'noconnect' | 'passive';

export interface User {
  id: string;
  cid: string;
  nicks: string;
  hub_names: string;
  hub_urls: string[];
  flags: UserFlag[];
}

export interface HintedUserBase {
  cid: string;
  hub_url: string;
}

export interface OfflineHintedUser extends HintedUserBase {
  nicks: string;
}

export interface HintedUser extends HintedUserBase {
  nicks: string;
  hub_names: string;
  hub_urls: string[];
  flags: HubUserFlag[];
}

export interface HubUser extends HintedUserBase {
  id: number;
  hub_session_id: number;
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

export interface IgnoredUser {
  user: User;
  ignored_messages: number;
}

// POST data
export interface DownloadData {
  target_name: string;
  target_directory?: string;
  priority?: number;
}

// MISC
export interface HookError {
  hook_id: string;
  hook_name: string;
  error_id: string;
  str: string;
}

export const enum PriorityEnum {
  LOWEST = 2,
  LOW = 3,
  NORMAL = 4,
  HIGH = 5,
  HIGHEST = 6,
}

export const enum DownloadableItemStateEnum {
  DOWNLOAD_FAILED = 'download_failed',
  DOWNLOAD_PENDING = 'download_pending',
  DOWNLOADING = 'downloading',
  LOADING = 'loading',
  LOADED = 'loaded',
  DOWNLOADED = 'downloaded',
}

export interface DownloadableItemState {
  id: DownloadableItemStateEnum;
  str: string;
  time_finished: number;
}
