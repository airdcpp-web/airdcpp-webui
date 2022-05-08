import { Component } from 'react';

import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';


import * as UI from 'types/ui';


interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<UI.PropsWithChildren, ErrorBoundaryState> {
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
        <div style={{ margin: '10px' }}>
          <h1>
            Web UI has crashed 
          </h1>
          <p>
            Please submit a bug report with the requested information (and the crash details below) at the
            { ' ' }
            <ExternalLink
              url={ LinkConstants.ISSUE_TRACKER_URL }
            >
              issue tracker
            </ExternalLink>
            .
          </p>
          <h2>
            Crash details
          </h2>
          <pre>
            { this.state.error.stack }
          </pre>
        </div>
      );
    }

    return this.props.children; 
  }
}