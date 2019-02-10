import { Notification as ReactNotification } from 'react-notification-system';


export interface Notification extends Omit<ReactNotification, 'body' | 'title'> {
  title: string;
  message?: string;
}