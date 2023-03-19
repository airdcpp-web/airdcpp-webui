import PropTypes from 'prop-types';
import React, { Component } from 'react';

import IconConstants from 'constants/IconConstants';

import Accordion from 'components/semantic/Accordion';
import Icon from 'components/semantic/Icon';
import Message from 'components/semantic/Message';

import { translate } from 'utils/TranslationUtils';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { PathDownloadHandler } from '../../types';

import PathList from './PathList';

interface AccordionTargetsProps {
  groupedPaths: API.GroupedPath[];
  downloadHandler: PathDownloadHandler;
  t: UI.TranslateF;
}

class AccordionTargets extends Component<AccordionTargetsProps> {
  static propTypes = {
    // Function handling the path selection. Receives the selected path as argument.
    downloadHandler: PropTypes.func.isRequired,

    // Grouped paths to list
    groupedPaths: PropTypes.array.isRequired,
  };

  formatParent = (parent: API.GroupedPath) => {
    const { downloadHandler, t } = this.props;
    return (
      <React.Fragment key={parent.name}>
        <div className="title">
          <Icon icon={IconConstants.DROPDOWN} />
          {parent.name}
        </div>

        <div className="content">
          <PathList paths={parent.paths} downloadHandler={downloadHandler} t={t} />
        </div>
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
