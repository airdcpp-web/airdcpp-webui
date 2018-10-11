'use strict';
import React from 'react';
import { Prompt } from 'react-router-dom';
import invariant from 'invariant';

import Message from 'components/semantic/Message';
import SaveButton, { SaveButtonProps } from '../components/SaveButton';
import NotificationActions from 'actions/NotificationActions';

import LoginStore from 'stores/LoginStore';
import Form, { FormFieldChangeHandler } from 'components/form/Form';

import * as API from 'types/api';
import { ChildSectionType } from './SettingsMenuDecorator';
import { Location } from 'history';


export interface SaveDecoratorProps {
  currentMenuItem: ChildSectionType;
}

export interface SaveDecoratorChildProps {
  saveButton: React.ReactElement<SaveButtonProps> | false;
  message: React.ReactNode;
}

type SaveableRef = Form;


export interface SaveDecoratorContext {
  onFieldChanged: FormFieldChangeHandler;
  addFormRef: (c: SaveableRef) => void;
}

export const SaveDecoratorContext = React.createContext<SaveDecoratorContext | undefined>(undefined);


export interface SaveContextProps {
  saveContext: SaveDecoratorContext;
}

export function withSaveContext<PropsT>(Component: React.ComponentType<PropsT & SaveContextProps>) {
  return (props: PropsT) => {
    return (
      <SaveDecoratorContext.Consumer>
        { context => <Component {...props} saveContext={ context! } /> }
      </SaveDecoratorContext.Consumer>
    );
  };
}

export default function <PropsT extends object>(
  Component: React.ComponentType<SaveDecoratorChildProps>
) {
  class SaveDecorator extends React.Component<SaveDecoratorProps & PropsT> {
    static displayName = 'SaveDecorator';

    forms: SaveableRef[] = [];
    changedProperties = new Set<string>();

    componentDidUpdate(prevProps: SaveDecoratorProps) {
      if (prevProps.currentMenuItem.url !== this.props.currentMenuItem.url) {
        this.changedProperties.clear();
      }
    }

    onSettingsChanged: FormFieldChangeHandler = (id, value, hasChanges) => {
      if (hasChanges) {
        this.changedProperties.add(id);
      } else {
        this.changedProperties.delete(id);
      }

      this.forceUpdate();
    }

    onSettingsSaved = () => {
      NotificationActions.success({ 
        title: 'Saving completed',
        message: 'Settings were saved successfully',
      });

      this.forceUpdate();
    }

    handleSave = () => {
      invariant(this.forms.length > 0, 'No forms exist in SaveDecorator');
      const promises = this.forms.map(c => c.save());
      this.changedProperties.clear();

      return Promise.all(promises)
        .then(this.onSettingsSaved);
    }

    hasChanges = () => {
      return this.changedProperties.size > 0;
    }

    promptSave = (location: Location) => {
      const { currentMenuItem } = this.props;
      if (currentMenuItem.noSave) {
        return true;
      }

      const hasChanges = this.hasChanges() && LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT);
      return hasChanges ? 'You have unsaved changes. Are you sure you want to leave?' : true;
    }

    saveFormRef = (c: SaveableRef) => {
      if (c) {
        invariant(
          c.hasOwnProperty('save'), 
          'Invalid setting form component supplied for SaveDecorator (save property missing)'
        );
        this.forms.push(c);
      } else {
        // Switching to another page 
        // Single forms shouldn't be unmounted otherwise, but using identifiers would still be safer...
        this.forms = [];
      }
    }

    saveContext: SaveDecoratorContext = {
      onFieldChanged: this.onSettingsChanged,
      addFormRef: this.saveFormRef,
    };

    render() {
      const { currentMenuItem, children } = this.props;

      const message = currentMenuItem.local && (
        <Message 
          description="Settings listed on this page are browser-specific"
          icon="blue info"
        />
      );

      const saveButton = !currentMenuItem.noSave && (
        <SaveButton 
          saveHandler={ this.handleSave } 
          hasChanges={ this.hasChanges() }
          local={ currentMenuItem.local }
        />
      );

      return (
        <Component 
          { ...this.props }
          saveButton={ saveButton }
          message={ message }
        >
          <SaveDecoratorContext.Provider value={ this.saveContext }>
            <Prompt
              message={ this.promptSave }
            />
            { children }
          </SaveDecoratorContext.Provider>
        </Component>
      );
    }
  }

  return SaveDecorator;
}
