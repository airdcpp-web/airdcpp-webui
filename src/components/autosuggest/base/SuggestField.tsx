import * as React from 'react';
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

type SubmitHandlerType<SuggestionT> = (value: string, suggestion?: SuggestionT) => void;

export type SuggestFieldProps<SuggestionT> = Omit<
  Autosuggest.AutosuggestPropsSingleSection<SuggestionT>,
  'inputProps'
> &
  React.PropsWithChildren<{
    // Default input value to show
    // The input will also be updated accordingly when a different stored value is received
    defaultValue?: string;

    // Disables the field action button
    disabled?: boolean;

    // Providing a button element makes the input accept custom inputs when pressing enter
    // The same submitHandler is called but without suggestion object
    button?: React.ReactElement<ButtonProps>;

    autoFocus?: boolean;
    placeholder?: string;
    className?: string;
    onSuggestionsClearRequested: () => void;

    // Function to call when the input text was changed
    onChange?: (text: string) => void;

    // Function to call when selecting suggestions
    // Receives the suggestion value and the suggestion object (only if selecting a suggestion)
    submitHandler?: SubmitHandlerType<SuggestionT>;
  }>;

class SuggestField<SuggestionT = any> extends React.Component<
  SuggestFieldProps<SuggestionT>
> {
  static defaultProps = {
    autoFocus: true,
    defaultValue: '',
  };

  state = {
    text: this.props.defaultValue || '',
  };

  componentDidUpdate(prevProps: SuggestFieldProps<SuggestionT>) {
    // The received default value has changed?
    // Always update the field value in that case
    if (prevProps.defaultValue !== this.props.defaultValue) {
      this.setState({
        text: this.props.defaultValue,
      });
    }
  }

  handleSubmit = (event: React.FormEvent, suggestion?: SuggestionT) => {
    if (this.props.submitHandler) {
      const value = suggestion
        ? this.props.getSuggestionValue(suggestion)
        : this.state.text;
      this.props.submitHandler(value, suggestion);
    }
  };

  onTextChange = (evt: React.FormEvent, { newValue }: Autosuggest.ChangeEvent) => {
    this.setState({
      text: newValue,
    });

    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  };

  isSubmitDisabled = () => {
    return this.state.text.length === 0;
  };

  getSuggestionValue = (suggestion: SuggestionT) => {
    return suggestion;
  };

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Accept custom inputs only when there's a submit button
    if (!this.props.button || this.isSubmitDisabled()) {
      return;
    }

    if (event.key === 'Enter' && !event.isDefaultPrevented()) {
      // Hide the suggestion menu
      this.props.onSuggestionsClearRequested();

      this.handleSubmit(event);
    }
  };

  onSuggestionSelected: Autosuggest.OnSuggestionSelected<SuggestionT> = (
    event,
    { suggestion, suggestionValue, method },
  ) => {
    // No second 'Enter' event if the suggestion was selected
    event.preventDefault();

    this.handleSubmit(event, suggestion);
  };

  render() {
    const {
      className,
      autoFocus,
      placeholder,
      defaultValue,
      button,
      children,
      ...other
    } = this.props;
    const { text } = this.state;

    const inputAttributes: Autosuggest.InputProps<SuggestionT> = {
      placeholder,
      onChange: this.onTextChange,
      autoFocus,
      value: text,
      onKeyDown: this.onKeyDown,
    };

    const suggestField = (
      <Autosuggest
        {...other}
        theme={theme}
        //initialValue={ defaultValue }
        inputProps={inputAttributes}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );

    const fieldStyle = classNames('ui fluid input', { action: !!button }, className);

    if (button) {
      return (
        <div className={fieldStyle}>
          {suggestField}
          {React.cloneElement(button, {
            onClick: (evt: any) => this.handleSubmit(evt),
            disabled: this.isSubmitDisabled() || this.props.disabled,
          })}
          {children}
        </div>
      );
    }

    return (
      <div className={fieldStyle}>
        {suggestField}
        {children}
      </div>
    );
  }
}

export default SuggestField;
