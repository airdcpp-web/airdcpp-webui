export interface SystemInfo {
  api_version: number;
  api_feature_level: number;
  hostname: string;
  language: string;
  path_separator: string;
  client_version: string;
  client_started: number;
  platform: PlatformEnum;
}

export enum PlatformEnum {
  WINDOWS = 'win32',
  MAC = 'darwin',
  LINUX = 'linux',
  FREEBSD = 'freebsd',
  OTHER = 'other',
}

export enum AwayEnum {
  OFF = 'off',
  IDLE = 'idle',
  MANUAL = 'manual',
}

export interface AwayState {
  id: AwayEnum;
}
