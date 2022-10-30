export interface Notification {
  title: string;
  message?: string;
  action?: {
    label: string;
    callback: () => any
  }
  uid?: string;
}