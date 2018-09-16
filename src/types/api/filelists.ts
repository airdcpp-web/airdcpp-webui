import { HintedUser, DownloadableItemState, FileItemType, Dupe } from './common';
import { ShareProfileBasic } from './shareprofiles';

export interface FilelistSession {
  id: string;
  user: HintedUser;
  location: FilelistItem;
  share_profile?: ShareProfileBasic;
  state: DownloadableItemState;
  read: boolean;
  partial_list: boolean;
  total_files: number;
  total_size: number;
}

export interface FilelistItem {
  id: number;
  name: string;
  type: FileItemType;
  path: string;
  tth: string;
  dupe: Dupe;
  time: number;
  size: number;
  complete: boolean;
}