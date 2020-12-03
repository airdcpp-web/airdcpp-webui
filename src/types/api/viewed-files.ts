import { DownloadableItemState, FileType } from './common';

export interface ViewFile {
  id: string;
  name: string;
  size: number;
  type: FileType;
  tth: string;
  text: boolean;
  time_opened: number;
  read: boolean;
  download_state: DownloadableItemState | null;
  content_ready: boolean;
  mime_type: string;
}
