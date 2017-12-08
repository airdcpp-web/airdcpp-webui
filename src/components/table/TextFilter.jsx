import PropTypes from 'prop-types';
import React from 'react';

import { FilterMethod } from 'constants/TableConstants';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import { MenuItemLink } from 'components/semantic/MenuItem';

import TableFilterDecorator from 'decorators/TableFilterDecorator';


const filterMethodToString = (method) => {
  switch (method) {
  case FilterMethod.REGEX: return 'Regex';
  case FilterMethod.WILDCARD: return 'Wildcard';
  case FilterMethod.EXACT: return 'Exact';
  default: return 'Partial';
  }
};

const getPlaceholder = (method) => {
  let ret = 'Filter';
  if (method !== FilterMethod.PARTIAL) {
    ret += ' (' + filterMethodToString(method).toLowerCase() + ')';
  }

  return ret + '...';
};

class FilterBox extends React.Component {
  static propTypes = {
    viewUrl: PropTypes.string.isRequired,
  };

  state = { 
    value: '',
    method: FilterMethod.PARTIAL,
  };

  componentWillMount() {
    this._timer = null;
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  onFilterUpdated = () => {
    const { value, method } = this.state;
    this.props.onFilterUpdated(value, method);
  };

  onTextChanged = (event) => {
    this.setState({ 
      value: event.target.value 
    });

    clearTimeout(this._timer);

    this._timer = setTimeout(() => {
      this._timer = null;
      this.onFilterUpdated();
    }, 200);
  };

  onMethodChanged = (method) => {
    this.setState({ 
      method,
    });

    setTimeout(_ => this.onFilterUpdated());
    this.input.focus();
  };

  getFilterMethod = (method) => {
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
  };

  render() {
    return (
      <div className="text-filter">
        <div 
          className="ui action input" 
          onChange={ this.onTextChanged } 
          value={ this.state.value }
        >
          <input 
            ref={ c => this.input = c }
            placeholder={ getPlaceholder(this.state.method) } 
            type="text"
          />
          <SectionedDropdown 
            className="filter-method right top pointing"
            button={ true }
            direction="upward"
          >
            <MenuSection caption="Match type">
              { Object.keys(FilterMethod)
                .map(key => this.getFilterMethod(FilterMethod[key])) }
            </MenuSection>
          </SectionedDropdown>
        </div>
      </div>
    );
  }
}

export default TableFilterDecorator(FilterBox);