import React, { Component } from 'react';

import IconConstants from '@/constants/IconConstants';

import Accordion, {
  AccordionContent,
  AccordionTitle,
} from '@/components/semantic/Accordion';
import Icon from '@/components/semantic/Icon';
import Message from '@/components/semantic/Message';

import { translate } from '@/utils/TranslationUtils';

import * as API from '@/types/api';
import * as UI from '@/types/ui';
import { PathDownloadHandler } from '../../types';

import PathList from './PathList';

interface AccordionTargetsProps {
  // Grouped paths to list
  groupedPaths: API.GroupedPath[];

  // Function handling the path selection. Receives the selected path as argument.
  downloadHandler: PathDownloadHandler;

  t: UI.TranslateF;
}

class AccordionTargets extends Component<AccordionTargetsProps> {
  formatParent = (parent: API.GroupedPath, index: number) => {
    const { downloadHandler, t } = this.props;
    return (
      <React.Fragment key={parent.name}>
        <AccordionTitle id={parent.name} index={index}>
          <Icon icon={IconConstants.DROPDOWN} />
          {parent.name}
        </AccordionTitle>

        <AccordionContent id={parent.name} index={index}>
          <PathList paths={parent.paths} downloadHandler={downloadHandler} t={t} />
        </AccordionContent>
      </React.Fragment>
    );
  };

  render() {
    const { groupedPaths, t } = this.props;
    if (groupedPaths.length === 0) {
      return <Message title={translate('No paths to display', t, UI.Modules.COMMON)} />;
    }

    return (
      <Accordion className="styled download-targets">
        {groupedPaths.map(this.formatParent)}
      </Accordion>
    );
  }
}

export default AccordionTargets;
