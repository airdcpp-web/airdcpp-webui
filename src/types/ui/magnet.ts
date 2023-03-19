export interface Magnet {
  name: string;
  size: number | undefined;
}
export interface HashMagnet extends Magnet {
  tth: string;
  size: number;
  searchString?: undefined;
}
export interface TextMagnet extends Magnet {
  tth?: undefined;
  searchString: string;
}
