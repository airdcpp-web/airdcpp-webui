declare namespace API {
  interface SearchResponse {
    queue_time: number;
    search_id: number;
    queued_count: number;
  }

  interface GroupedSearchResult {
    id: string
    name: string;
    relevance: number
    hits: number
    users: SearchResultUserInfo;
    type: FileItemType;
    path: string;
    tth: string;
    dupe: Dupe;
    time: number;
    slots: SlotCount;
    connection: number;
    size: number;
  }

  interface SearchResultUserInfo {
    count: number;
    user: HintedUser;
  }

  interface SlotCount {
    free: number;
    total: number;
    str: string;
  }
}
