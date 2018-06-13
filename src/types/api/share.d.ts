declare namespace API {
  export interface ShareRootStatus {
    id: 'normal' | 'refresh_pending' | 'refresh_running';
    str: string;
  }

  export interface ShareRootEntryBase extends Partial<UI.FormValueMap> {
    virtual_name: string;
    path: string;
    incoming: boolean;
    profiles: number[];
    size: number;
    last_refresh_time: number;
  }

  export type ShareRootEntry = ShareRootEntryBase & {
    id: string;
    type: API.DirectoryType;
    status: ShareRootStatus;
  }
}
