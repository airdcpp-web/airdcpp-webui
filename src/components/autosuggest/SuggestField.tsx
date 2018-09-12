import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Autosuggest, { Theme, Omit } from 'react-autosuggest';

//@ts-ignore
import { defaultTheme } from 'react-autosuggest/dist/theme';

import { ButtonProps } from 'components/semantic/Button';


const theme: Theme = {
  ...defaultTheme,
  container: 'react-autosuggest__container ui input',
  suggestionsList: 'ui vertical fluid menu',
  suggestion: 'link item',
  suggestionHighlighted: 'link item active',
};

type SuggestionType = any;
type SubmitHandlerType = (value: string, suggestion: SuggestionType) => void;

export interface SuggestFieldProps extends Omit<Autosuggest.AutosuggestProps<SuggestionType>, 'inputProps'> {
  defaultValue?: string;
  disabled?: boolean;
  button?: React.ReactElement<ButtonProps>;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  onSuggestionsClearRequested: () => void;
  onChange?: (text: string) => void;

  submitHandler?: SubmitHandlerType;
}

class SuggestField extends React.Component<SuggestFieldProps> {
  static propTypes = {

    /**
		 * Function to call when selecting suggestions
		 * Receives the suggestion value and the suggestion object (only if selecting a suggestion)
		 */
    submitHandler: PropTypes.func,

    /**
		 * Function to call when the input text was changed
		 */
    onChange: PropTypes.func,

    /**
		 * Providing a button element makes the input accept custom inputs when pressing enter
		 * The same submitHandler is called but without suggestion object
		 */
    button: PropTypes.element,

    placeholder: PropTypes.string,

    /**
		 * Default input value to show
		 * The input will also be updated accordingly when a different stored value is received
		 */
    defaultValue: PropTypes.string,

    /**
		 * Disables the field action button
		 */
    disabled: PropTypes.bool,
  };

  static defaultProps: Partial<SuggestFieldProps> = {
    autoFocus: true,
    defaultValue: '',
  };

  state = {
    text: this.props.defaultValue || '',
  };

  UNSAFE_componentWillReceiveProps(nextProps: SuggestFieldProps) {
    // The received default value has changed?
    // Always update the field value in that case
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ 
        text: nextProps.defaultValue 
      });
    }
  }

  handleSubmit = (event: any, suggestion?: SuggestionType) => {
    if (this.props.submitHandler) {
      const value = suggestion ? this.props.getSuggestionValue(suggestion) : this.state.text;
      this.props.submitHandler(value, suggestion);
    }
  };

  onTextChange = (evt: any, { newValue }: Autosuggest.ChangeEvent) => {
    this.setState({ 
      text: newValue 
    });

    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  };

  isSubmitDisabled = () => {
    return this.state.text.length === 0;
  };

  getSuggestionValue = (suggestion: SuggestionType) => {
    return suggestion;
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Accept custom inputs only when there's a submit button
    if (!this.props.button || this.isSubmitDisabled()) {
      return;
    }

    if (event.keyCode === 13 && !event.isDefaultPrevented()) {
      // Hide the suggestion menu
      this.props.onSuggestionsClearRequested();

      this.handleSubmit(event);
    }
  };

  onSuggestionSelected: Autosuggest.OnSuggestionSelected<SuggestionType> = (event: any, { suggestion, suggestionValue, method }) => {
    // No second 'Enter' event if the suggestion was selected
    event.preventDefault();

    this.handleSubmit(event, suggestion);
  };

  render() {
    const { className, autoFocus, placeholder, defaultValue, button, ...other } = this.props;
    const { text } = this.state;

    const inputAttributes: Autosuggest.InputProps<SuggestionType> = {
      placeholder: placeholder,
      onChange: this.onTextChange,
      autoFocus: autoFocus,
      value: text,
      onKeyDown: this.onKeyDown,
    };

    const suggestField = (
      <Autosuggest 
        { ...other }
        theme={ theme }
        //initialValue={ defaultValue }
        inputProps={ inputAttributes } 
        onSuggestionSelected={ this.onSuggestionSelected }
      />
    );

    const fieldStyle = classNames(
      'ui fluid input',
      { 'action': !!button },
      className,
    );

    if (button) {
      return (
        <div className={ fieldStyle }>
          { suggestField }
          { React.cloneElement(button, {
            onClick: (evt: any) => this.handleSubmit(evt),
            disabled: this.isSubmitDisabled() || this.props.disabled,
          }) }
        </div>
      );
    }

    return (
      <div className={ fieldStyle }>
        { suggestField }
      </div>
    );
  }
}

export default SuggestField;