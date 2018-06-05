import PropTypes from 'prop-types';
import React from 'react';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';

import HistoryConstants from 'constants/HistoryConstants';
import HistoryActions from 'actions/HistoryActions';

import LocalSuggestField from './LocalSuggestField';


export interface HistoryInputProps extends DataProviderDecoratorChildProps {
  historyId: string;
  history: string[];
  submitHandler: (text: string) => void;
}

interface HistoryInputDataProps {
  history: string[];
}

class HistoryInput extends React.Component<HistoryInputProps> {
  static propTypes = {

    /**
		 * ID of the history section
		 */
    historyId: PropTypes.string.isRequired,

    history: PropTypes.array.isRequired,

    submitHandler: PropTypes.func.isRequired,
  };

  handleSubmit = (text: string) => {
    HistoryActions.add(this.props.historyId, text);

    this.props.refetchData();
    this.props.submitHandler(text);
  };

  render() {
		const { submitHandler, historyId, history, ...other } = this.props; // eslint-disable-line
    return (
      <LocalSuggestField 
        { ...other }
        data={ history }
        submitHandler={ this.handleSubmit }
      />
    );
  }
}

export default DataProviderDecorator<HistoryInputProps, HistoryInputDataProps>(HistoryInput, {
  urls: {
    history: ({ historyId }, socket) => socket.get(HistoryConstants.STRINGS_URL + '/' + historyId),
  },
  loaderText: null,
});
