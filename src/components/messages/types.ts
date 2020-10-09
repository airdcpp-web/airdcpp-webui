import { IntersectionObserverProps } from 'react-intersection-observer';

import * as UI from 'types/ui';


export interface CommonMessageProps extends Omit<IntersectionObserverProps, 'children'> {
  menuProps: UI.MessageActionMenuData;
}