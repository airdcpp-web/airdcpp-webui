import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';

import 'semantic-ui-css/components/checkbox';
import 'semantic-ui-css/components/checkbox.min.css';


export interface CheckboxProps {
  onChange: (checked: boolean) => void;
  type?: string;
  caption?: React.ReactNode;
  disabled?: boolean;
  floating?: boolean;
  checked: boolean;
  className?: string;
}

class Checkbox extends React.PureComponent<CheckboxProps> {
  static propTypes = {

    // Selection state
    checked: PropTypes.bool.isRequired,

    // Handler for state changes (receives bool as argument)
    onChange: PropTypes.func.isRequired,

    // Checkbox caption
    caption: PropTypes.node,

    // Display type (slider or toggle), leave undefined for default
    type: PropTypes.string,

    disabled: PropTypes.bool,
    floating: PropTypes.bool,
  };

  c: any;
  componentDidMount() {
    const settings: SemanticUI.CheckboxSettings = {
      fireOnInit: false,
      onChecked: () => this.props.onChange(true),
      onUnchecked: () => this.props.onChange(false),
    };

    $(this.c).checkbox(settings);
  }

  componentDidUpdate(prevProps: CheckboxProps) {
    if (prevProps.checked !== this.props.checked) {
      if (this.props.checked) {
        $(this.c).checkbox('set checked');
      } else {
        $(this.c).checkbox('set unchecked');
      }
    }
  }

  render() {
    const { className, checked, caption, type, disabled, floating } = this.props;

    const checkboxStyle = classNames(
      'ui checkbox',
      { 'disabled': disabled },
      { 'floating': floating },
      className,
      type,
    );

    return (
      <div 
        ref={ c => this.c = c }
        className={ checkboxStyle }
      >
        <input type="checkbox" defaultChecked={ checked }/>
        { !!caption && (
          <label>
            { caption }
          </label>
        ) }
      </div>
    );
  }
}

export default Checkbox;