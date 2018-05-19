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
  interface FileItemInfo {
    path: string;
    dupe: {
      paths: string[];
    };
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
  

  // ENCRYPTION
  export interface EncryptionInfo {
    str: string;
    trusted: boolean;
  }

  
  // USERS
  export type UserFlag = 'self' | 'bot' | 'asch' | 'ccpm' | 'ignored' | 'favorite' | 'nmdc' | 'offline' | 'op';

  export type HubUserFlag = UserFlag | 'away' | 'op' | 'hidden' | 'noconnect' | 'passive';

  interface HintedUserBase {
    cid: string;
    hub_url: string;
  }


  // POST data
  interface DownloadData {
    target_name: string;
    target_directory: string;
    priority: number;
  }
}