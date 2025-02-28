import { ApplicationWidgetInfo } from './Application';
import { ExtensionWidgetInfo } from './Extensions';
import { NotepadWidgetInfo } from './Notepad';
import { RSSWidgetInfo } from './RSS';
import { TransferWidgetInfo } from './Transfers';

export const Widgets = [
  ApplicationWidgetInfo,
  RSSWidgetInfo,
  NotepadWidgetInfo,
  TransferWidgetInfo,
  ExtensionWidgetInfo,
];

export * from './Application';
export * from './Extensions';
export * from './Notepad';
export * from './RSS';
export * from './Transfers';
