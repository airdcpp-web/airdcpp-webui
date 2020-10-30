import { PureComponent } from 'react';
import t from 'utils/tcomb-form';

import * as API from 'types/api';
import * as UI from 'types/ui';

import HubSelectField from './HubSelectField';
import SizeField from './SizeField';
import FileTypeField from './FileTypeField';

import Form, { FormFieldChangeHandler, FormSaveHandler, FormFieldSettingHandler } from 'components/form/Form';
import { translateForm } from 'utils/FormUtils';
import { RouteComponentProps } from 'react-router';
import Button from 'components/semantic/Button';
import { SearchQuery } from 'types/api';




interface Entry extends Pick<SearchQuery, 'file_type' | 'min_size' | 'max_size' | 'excluded'>, UI.FormValueMap {
  hub_urls: string[] | null;
  // file_type: string | null;
  // min_size: number | null;
  // max_size: number | null;
  // excluded: string[] | null;
}

export interface SearchOptionsFormProps extends Pick<RouteComponentProps, 'location'> {
  moduleT: UI.ModuleTranslator;
  onChange: (value: Entry | null) => void;
  value: Entry | null;
  hubs: API.Hub[];
}


const Fields: UI.FormFieldDefinition[] = [
  {
    key: 'file_type',
    title: 'File type',
    type: API.SettingTypeEnum.STRING,
    optional: true,
  }, {
    key: 'hub_urls',
    title: 'Hubs',
    type: API.SettingTypeEnum.LIST,
    item_type: API.SettingTypeEnum.STRING,
  }, {
    key: 'min_size',
    title: 'Minimum size',
    type: API.SettingTypeEnum.NUMBER,
    optional: true,
  }, {
    key: 'max_size',
    title: 'Maximum size',
    type: API.SettingTypeEnum.NUMBER,
    optional: true,
  },  /*, {
    key: 'excluded',
    title: 'Excluded words',
    type: API.SettingTypeEnum.LIST,
    item_type: API.SettingTypeEnum.STRING,
    optional: true,
  }*/
];

const removeEmptyProperties = (value: Entry) => {
  const ret = Object
    .keys(value)
    .reduce(
      (reduced, key) => {
        if (Array.isArray(value[key]) ? !!(value[key] as Array<any>).length : !!value[key]) {
          reduced[key] = value[key] as any;
        }

        return reduced;
      },
      {} as Entry
    );

  return ret;
};

class SearchOptionsForm extends PureComponent<SearchOptionsFormProps> {
  static displayName = 'SearchOptionForm';

  constructor(props: SearchOptionsFormProps) {
    super(props);

    this.definitions = translateForm(Fields, props.moduleT);
  }

  definitions: UI.FormFieldDefinition[];
  form: Form<Entry>;

  onFieldChanged: FormFieldChangeHandler<Entry> = (id, value, hasChanges) => {
    const ret = removeEmptyProperties(value as Entry);
    this.props.onChange(!!Object.keys(ret).length ? ret : null);
    return null;
  }

  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<Entry> = (changedFields) => {
    return Promise.resolve();
  }

  onFieldSetting: FormFieldSettingHandler<Entry> = (id, fieldOptions, formValue) => {
    if (id === 'hub_urls') {
      Object.assign(fieldOptions, {
        factory: t.form.Select,
        template: HubSelectField,
        options: this.props.hubs,
      });
    } else if (id === 'min_size' || id === 'max_size') {
      Object.assign(fieldOptions, {
        // factory: t.form.List,
        template: SizeField,
      });
    } else if (id === 'excluded') {
      Object.assign(fieldOptions, {
        disableOrder: true,
      });
    } else if (id === 'file_type') {
      Object.assign(fieldOptions, {
        template: FileTypeField,
      });
    }
  }

  render() {
    const { value, onChange, location, moduleT } = this.props;
    return (
      <div>
        <Form<Entry>
          ref={ c => this.form = c! }
          onFieldChanged={ this.onFieldChanged }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          fieldDefinitions={ this.definitions }
          value={ value }
          location={ location }
          optionTitleFormatter={ def => def.title }
        />
        <Button
          caption={ moduleT.translate('Reset all') }
          onClick={ () => onChange(null) }
          disabled={ !value }
          style={{
            marginTop: '10px'
          }}
        />
      </div>
    );
  }
}

export { SearchOptionsForm, Entry as SearchOptions };
