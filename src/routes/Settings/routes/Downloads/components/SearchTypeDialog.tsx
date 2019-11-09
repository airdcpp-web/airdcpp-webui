import React from 'react';
import Modal from 'components/semantic/Modal';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';

import IconConstants from 'constants/IconConstants';
import SocketService from 'services/SocketService';

import Form, { FormFieldSettingHandler, FormSaveHandler } from 'components/form/Form';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { translateForm } from 'utils/FormUtils';
import SearchConstants from 'constants/SearchConstants';


const Entry: UI.FormFieldDefinition[] = [
  {
    key: 'name',
    title: 'Name',
    type: API.SettingTypeEnum.STRING,
  },
  {
    key: 'extensions',
    title: 'File extensions',
    type: API.SettingTypeEnum.LIST,
    item_type: API.SettingTypeEnum.STRING
  },
];

export interface SearchTypeDialogProps {
  moduleT: UI.ModuleTranslator;
}

interface Entry extends API.SearchType, UI.FormValueMap {

}

export interface DataProps extends DataProviderDecoratorChildProps {
  searchTypeEntry?: API.SearchType;
}

interface RouteProps {
  searchTypeId: string; 
}

type Props = SearchTypeDialogProps & DataProps & ModalRouteDecoratorChildProps<RouteProps>;

class SearchTypeDialog extends React.Component<Props> {
  static displayName = 'SearchTypeDialog';

  form: Form<Entry>;
  fieldDefinitions = translateForm(Entry, this.props.moduleT);

  isNew = () => {
    return !this.props.searchTypeEntry;
  }

  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<Entry> = (changedFields) => {
    if (this.isNew()) {
      return SocketService.post(SearchConstants.SEARCH_TYPES_URL, changedFields);
    }

    return SocketService.patch(
      `${SearchConstants.SEARCH_TYPES_URL}/${this.props.searchTypeEntry!.id}`, 
      changedFields
    );
  }

  onFieldSetting: FormFieldSettingHandler<Entry> = (id, fieldOptions, formValue) => {
    if (id === 'name') {
      const { searchTypeEntry } = this.props;
      fieldOptions.disabled = !!searchTypeEntry && searchTypeEntry.default_type;
    }
  }

  render() {
    const { moduleT, searchTypeEntry } = this.props;
    const title =  moduleT.translate(this.isNew() ? 'Add search type' : 'Edit search type');
    return (
      <Modal 
        className="search-type" 
        title={ title } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.FOLDER } 
        { ...this.props }
      >
        <Form<Entry>
          ref={ c => this.form = c! }
          fieldDefinitions={ this.fieldDefinitions }
          onFieldSetting={ this.onFieldSetting }
          onSave={ this.onSave }
          value={ searchTypeEntry as Entry }
          location={ this.props.location }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<SearchTypeDialogProps, RouteProps>(
  DataProviderDecorator<Omit<Props, keyof DataProps>, DataProps>(SearchTypeDialog, {
    urls: {
      searchTypeEntry: ({ match }, socket) => {
        if (!match.params.searchTypeId) {
          return Promise.resolve(undefined);
        }

        return socket.get(`${SearchConstants.SEARCH_TYPES_URL}/${match.params.searchTypeId}`);
      },
    }
  }),
  'types/:searchTypeId?'
);