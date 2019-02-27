'use strict';
//@ts-ignore
import Reflux from 'reflux';

import * as UI from 'types/ui';


const WidgetActionConfig: UI.RefluxActionConfigList<any> = [
  'create',
  'edit',
  'remove',
];

const WidgetActions = Reflux.createActions(WidgetActionConfig);


//export default {
//  moduleId: UI.Modules.WIDGETS,
//  actions: WidgetActions,
//};

export default WidgetActions as UI.RefluxActionListType<void>;
