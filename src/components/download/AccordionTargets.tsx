import PropTypes from 'prop-types';
import React from 'react';

import Accordion from 'components/semantic/Accordion';
import Message from 'components/semantic/Message';
import PathList, { PathDownloadHandler } from './PathList';


interface AccordionTargetsProps {
  groupedPaths: API.GroupedPath[];
  downloadHandler: PathDownloadHandler;
}

class AccordionTargets extends React.Component<AccordionTargetsProps> {
  static propTypes = {
    // Function handling the path selection. Receives the selected path as argument.
    downloadHandler: PropTypes.func.isRequired,

    // Grouped paths to list
    groupedPaths: PropTypes.array.isRequired,
  };

  formatParent = (parent: API.GroupedPath) => {
    return (
      <div key={ parent.name }>
        <div className="title">
          <i className="dropdown icon"/>
          { parent.name }
        </div>

        <div className="content">
          <PathList 
            paths={ parent.paths } 
            downloadHandler={ this.props.downloadHandler }
          />
        </div>
      </div>
    );
  }

  render() {
    const { groupedPaths } = this.props;
    if (groupedPaths.length === 0) {
      return (
        <Message
          title="No paths to display"
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