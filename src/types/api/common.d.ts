declare namespace API {
  // FILES
  export type FileContentType = 'audio' | 'compressed' | 'document' | 'executable' | 'picture' | 'video' | 'other' | 'filelist';

  export interface DirectoryType {
    id: 'file';
    str: string;
    files: number;
    directories: number;
  }

  export interface FileType {
    id: 'directory';
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
    type: any;
  }


  // MESSAGES
  export interface MessageCounts {
    total_count: number;
    unread_counts: {
      user: number;
      bot: number;
      status: number;
    }
  }

  export type Severity = 'notify' | 'info' | 'warning' | 'error';

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

  interface HintedUser {
    nicks: string;
    hub_names: string;
    flags: HubUserFlag[];
  }

  interface HubUser {
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
}