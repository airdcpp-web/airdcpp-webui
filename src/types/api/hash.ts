export interface HashDatabaseStatus {
  maintenance_running: boolean;
  file_index_size: number;
  hash_store_size: number;
}

export interface HashStats {
  hash_speed: number;
  hash_bytes_left: number;
  hash_files_left: number;
  hashers: number;
}
