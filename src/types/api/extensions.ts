import { FilesystemItemType } from './common';


export interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  homepage: string;
  author: string;
  running: boolean;
  private: boolean;
  logs: FilesystemItemType[];
  engines: string[];
  managed: boolean;
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
};
