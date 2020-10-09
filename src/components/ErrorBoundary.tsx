import React from 'react';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';


interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { 
      error: null 
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <h1>
          Web UI has crashed with the following error: 
          { ' ' }
          { `"${this.state.error}"` }
          <br/>
          <br/>
          Please submit a bug report with the requested information (and the error message above) at the
          { ' ' }
          <ExternalLink
            url={ LinkConstants.ISSUE_TRACKER_URL }
          >
            issue tracker
          </ExternalLink>
          .
        </h1>
      );
    }

    return this.props.children; 
  }
}