export interface NpmPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  publisher: {
    username: string;
  };
}