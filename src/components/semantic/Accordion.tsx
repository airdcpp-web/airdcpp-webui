import PropTypes from 'prop-types';
import { Component } from 'react';

import 'fomantic-ui-css/components/accordion';
import 'fomantic-ui-css/components/accordion.min.css';

import cx from 'classnames';


type AccordionProps = React.PropsWithChildren<{
  controlled?: boolean;
  className?: string;
  defaultActiveIndexes?: number[];
}>;

class Accordion extends Component<AccordionProps> {
  static propTypes = {
    controlled: PropTypes.bool,
  };

  static defaultProps: Pick<AccordionProps, 'className'> = {
    className: '',
  };

  c: HTMLDivElement;
  componentDidMount() {
    let settings: SemanticUI.AccordionSettings | undefined;
    
    if (this.props.controlled) {
      settings = {
        on: 'disabled',
      };
    }

    $(this.c).accordion(settings);

    if (this.props.defaultActiveIndexes) {
      for (const index of this.props.defaultActiveIndexes) {
        $(this.c).accordion('open', index);
      }
    }
  }

  componentDidUpdate(prevProps: AccordionProps) {
    if (!prevProps.defaultActiveIndexes && !!this.props.defaultActiveIndexes) {
      for (const index of this.props.defaultActiveIndexes) {
        $(this.c).accordion('open', index);
      }
    }
  }

  render() {
    const classNames = cx(
      'ui accordion',
      this.props.className,
    );

    const { children } = this.props;
    return (
      <div 
        ref={ c => this.c = c! } 
        className={ classNames }
      >
        { children }
      </div>
    );
  }
}

type AccordionTitleProps = React.PropsWithChildren<{
  className?: string;
  active?: boolean;
  style?: React.CSSProperties;
}>;

export const AccordionTitle: React.FC<AccordionTitleProps> = ({ active, className, children, style }) => {
  const classNames = cx(
    'title',
    { active },
    className,
  ); 

  return (
    <div className={ classNames } style={ style }>
      { children }
    </div>
  );
};

export const AccordionContent: React.FC<AccordionTitleProps> = ({ active, className, children, style }) => {
  const classNames = cx(
    'content',
    { active },
    className,
  ); 

  return (
    <div className={ classNames } style={ style }>
      { children }
    </div>
  );
};


export default Accordion;
