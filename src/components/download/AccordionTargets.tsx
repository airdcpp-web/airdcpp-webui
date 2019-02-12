import PropTypes from 'prop-types';
import React from 'react';

import Accordion from 'components/semantic/Accordion';
import Message from 'components/semantic/Message';
import PathList, { PathDownloadHandler } from './PathList';

import * as API from 'types/api';
import * as UI from 'types/ui';

import i18next from 'i18next';
import { translate } from 'utils/TranslationUtils';


interface AccordionTargetsProps {
  groupedPaths: API.GroupedPath[];
  downloadHandler: PathDownloadHandler;
  t: i18next.TFunction;
}

class AccordionTargets extends React.Component<AccordionTargetsProps> {
  static propTypes = {
    // Function handling the path selection. Receives the selected path as argument.
    downloadHandler: PropTypes.func.isRequired,

    // Grouped paths to list
    groupedPaths: PropTypes.array.isRequired,
  };

  formatParent = (parent: API.GroupedPath) => {
    const { downloadHandler, t } = this.props;
    return (
      <div key={ parent.name }>
        <div className="title">
          <i className="dropdown icon"/>
          { parent.name }
        </div>

        <div className="content">
          <PathList 
            paths={ parent.paths } 
            downloadHandler={ downloadHandler }
            t={ t }
          />
        </div>
      </div>
    );
  }

  render() {
    const { groupedPaths, t } = this.props;
    if (groupedPaths.length === 0) {
      return (
        <Message
          title={ translate('No paths to display', t, UI.Modules.COMMON) }
        />
      );
    }

    return (
      <Accordion className="styled download-targets">
        { groupedPaths.map(this.formatParent) }
      </Accordion>
    );
  }
}

export default AccordionTargets;