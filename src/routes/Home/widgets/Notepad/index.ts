import * as UI from '@/types/ui';
//import * as API from '@/types/api';

import Notepad from './components/Notepad';

export const NotepadWidgetInfo = {
  typeId: 'notepad',
  component: Notepad,
  name: 'Notepad',
  icon: 'pen',
  //formSettings: [
  //  {
  //    key: 'markdown',
  //    title: 'Use Markdown',
  //    type: API.SettingTypeEnum.BOOLEAN,
  //    help: 'The content is Markdown formatted',
  //  },
  //],
  size: {
    w: 3,
    h: 5,
    minW: 2,
    minH: 4,
  },
} as UI.Widget;
