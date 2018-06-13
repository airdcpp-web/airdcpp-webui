declare namespace API {
  export interface FavoriteDirectoryEntryBase extends Partial<UI.FormValueMap> {
    name: string;
    path: string;
  }

  export type FavoriteDirectoryEntry = FavoriteDirectoryEntryBase & {
    id: string;
  }
}