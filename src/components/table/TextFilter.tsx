import React from 'react';

import SectionedDropdown from 'components/semantic/SectionedDropdown';
import MenuSection from 'components/semantic/MenuSection';
import MenuItemLink from 'components/semantic/MenuItemLink';

import TableFilterDecorator, { TableFilterDecoratorChildProps } from 'decorators/TableFilterDecorator';

import { FilterMethod } from 'types/api';
import { useMobileLayout } from 'utils/BrowserUtils';
import i18next from 'i18next';
import { translate } from 'utils/TranslationUtils';


const getFilterMethodCaption = (method: FilterMethod) => {
  switch (method) {
  case FilterMethod.REGEX: return 'Regex';
  case FilterMethod.WILDCARD: return 'Wildcard';
  case FilterMethod.EXACT: return 'Exact';
  default: return 'Partial';
  }
};

const filterMethodToString = (method: FilterMethod, t: i18next.TFunction) => {
  const methodTitle = getFilterMethodCaption(method);
  return translate(methodTitle, t, 'table.filter');
};

const getPlaceholder = (method: FilterMethod, t: i18next.TFunction) => {
  let ret = t('table.filter.filter', 'Filter');
  if (method !== FilterMethod.PARTIAL) {
    ret += ` (${filterMethodToString(method, t).toLowerCase()})`;
  }

  return ret + '...';
};

export interface TextFilterProps {
  autoFocus?: boolean;
  t: i18next.TFunction;
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
    const { t } = this.props;
    return (
      <MenuItemLink 
        key={ method }
        onClick={ () => this.onMethodChanged(method) }
        active={ isCurrent }
      >
        { filterMethodToString(method, t) }
      </MenuItemLink>
    );
  }

  render() {
    const { value, method } = this.state;
    const { autoFocus, t } = this.props;
    return (
      <div className="text-filter">
        <div 
          className="ui action input" 
        >
          <input 
            ref={ (c: any) => this.input = c }
            placeholder={ getPlaceholder(method, t) } 
            onChange={ this.onTextChanged } 
            value={ value }
            type="text"
            autoFocus={ !useMobileLayout() && autoFocus }
          />
          <SectionedDropdown 
            className="filter-method right top pointing"
            button={ true }
            direction="upward"
          >
            <MenuSection caption={ translate('Match type', t, 'table.filter') }>
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