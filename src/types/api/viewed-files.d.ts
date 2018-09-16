declare namespace API {
  interface ViewFile {
    id: string;
    name: string;
    size: number;
    type: API.FileType;
    tth: string;
    text: boolean;
    time_opened: number;
    read: boolean;
    download_state: DownloadableItemState;
    content_ready: boolean;
    mime_type: string;
  }
}
