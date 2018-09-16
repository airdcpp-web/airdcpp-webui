
export interface FavoriteDirectoryEntryBase {
  id: string;
  name: string;
  path: string;
}

export type FavoriteDirectoryEntry = FavoriteDirectoryEntryBase & {
  id: string;
};
