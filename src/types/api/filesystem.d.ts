declare namespace API {
  export interface FilesystemItem {
    name: string;
    type: FilesystemItemType;
    size: number;
  }

  export interface DiskSpaceInfo {
    path: string;
    free_space: number;
    total_space: number;
  }
}