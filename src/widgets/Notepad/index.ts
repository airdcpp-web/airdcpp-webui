import * as UI from 'types/ui';
//import * as API from 'types/api';

export const Notepad = {
  typeId: 'notepad',
  component: require('./components/Notepad').default,
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
    w: 5,
    h: 5,
    minW: 2,
    minH: 4,
  },
} as UI.Widget;