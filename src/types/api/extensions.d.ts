declare namespace API {
  export interface Extension {
    id: string;
    name: string;
    description: string;
    version: string;
    homepage: string;
    author: string;
    running: boolean;
    private: boolean
    logs: FilesystemItem[];
    engines: string[];
    managed: true
    has_settings: boolean;
  }

  export interface ExtensionInstallEventBase {
    install_id: string;
  }

  export type ExtensionInstallEvent = ExtensionInstallEventBase;

  export interface ExtensionInstallEventError extends ExtensionInstallEventBase {
    message: string;
  }

  export type ExtensionEngineStatus = {
    [engine: string]: string;
  }
}
