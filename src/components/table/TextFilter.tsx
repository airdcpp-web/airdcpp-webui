import React from 'react';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import MenuItemLink from 'components/semantic/MenuItemLink';

import TableFilterDecorator, { TableFilterDecoratorChildProps } from 'decorators/TableFilterDecorator';

import { FilterMethod } from 'types/api';


const filterMethodToString = (method: FilterMethod) => {
  switch (method) {
  case FilterMethod.REGEX: return 'Regex';
  case FilterMethod.WILDCARD: return 'Wildcard';
  case FilterMethod.EXACT: return 'Exact';
  default: return 'Partial';
  }
};

const getPlaceholder = (method: FilterMethod) => {
  let ret = 'Filter';
  if (method !== FilterMethod.PARTIAL) {
    ret += ` (${filterMethodToString(method).toLowerCase()})`;
  }

  return ret + '...';
};

export interface TextFilterProps {
  autoFocus?: boolean;
}

class TextFilter extends React.Component<TextFilterProps & TableFilterDecoratorChildProps> {
  state = { 
    value: '',
    method: FilterMethod.PARTIAL,
  };

  timer: NodeJS.Timer;
  input: HTMLInputElement;

  static defaultProps: Pick<TextFilterProps, 'autoFocus'> = {
    autoFocus: true,
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onFilterUpdated = () => {
    const { value, method } = this.state;
    this.props.onFilterUpdated(value, method);
  }

  onTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ 
      value: event.target.value 
    });

    clearTimeout(this.timer);

    this.timer = setTimeout(
      () => {
        this.onFilterUpdated();
      }, 
      200
    );
  }

  onMethodChanged = (method: FilterMethod) => {
    this.setState({ 
      method,
    });

    setTimeout(() => this.onFilterUpdated());
    this.input.focus();
  }

  getFilterMethod = (method: FilterMethod) => {
    const isCurrent = method === this.state.method;
    return (
      <MenuItemLink 
        key={ method }
        onClick={ () => this.onMethodChanged(method) }
        active={ isCurrent }
      >
        { filterMethodToString(method) }
      </MenuItemLink>
    );
  }

  render() {
    const { value, method } = this.state;
    const { autoFocus } = this.props;
    return (
      <div className="text-filter">
        <div 
          className="ui action input" 
        >
          <input 
            ref={ (c: any) => this.input = c }
            placeholder={ getPlaceholder(method) } 
            onChange={ this.onTextChanged } 
            value={ value }
            type="text"
            autoFocus={ autoFocus }
          />
          <SectionedDropdown 
            className="filter-method right top pointing"
            button={ true }
            direction="upward"
          >
            <MenuSection caption="Match type">
              { Object.keys(FilterMethod)
                .filter(key => isNaN(Number(key)))
                .map(key => this.getFilterMethod(FilterMethod[key])) }
            </MenuSection>
          </SectionedDropdown>
        </div>
      </div>
    );
  }
}

export default TableFilterDecorator<TextFilterProps>(TextFilter);