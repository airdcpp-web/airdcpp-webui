export interface ShareProfileBasic {
  id: number;
  str: string;
}

export interface ShareProfile {
  id: number;
  name: string;
  str: string;
  default: boolean;
  size: number;
  files: number;
}