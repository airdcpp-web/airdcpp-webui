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
}