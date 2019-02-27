export interface NpmPackage {
  name: string;
  description: string;
  version: string;
  publisher: {
    username: string;
  };
}