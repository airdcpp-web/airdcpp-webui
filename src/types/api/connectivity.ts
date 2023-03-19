export interface ConnectivityProtocolStatus {
  auto_detect: boolean;
  enabled: boolean;
  text: string;
  bind_address: string;
  external_ip: string;
}

export interface ConnectivityStatus {
  status_v4: ConnectivityProtocolStatus;
  status_v6: ConnectivityProtocolStatus;
  tcp_port: number;
  tls_port: number;
  udp_port: number;
}

export interface ConnectivityDetectionMessage {
  connectivity_detection_message: string;
}

export interface ConnectivityDetectionStarted {
  v6: boolean;
}

export interface ConnectivityDetectionFinished {
  v6: boolean;
  failed: boolean;
}

export const enum ConnectivityModeEnum {
  DISABLED = -1,
  ACTIVE_MODE = 0,
  ACTIVE_MODE_UPNP = 1,
  PASSIVE_MODE = 2,
}
