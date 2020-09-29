export interface NpmPackage {
  id: string;
  name: string;
  description: string;
  version: string;
  publisher: {
    username: string;
  };
  date: string;
  links?: {
    npm: string;
    bugs?: string;
    homepage?: string;
    repository?: string;
  };
}