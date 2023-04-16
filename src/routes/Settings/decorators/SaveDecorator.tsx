import * as React from 'react';
import { Prompt, RouteComponentProps } from 'react-router-dom';
import invariant from 'invariant';

import Message from 'components/semantic/Message';
import SaveButton, { SaveButtonProps } from '../components/SaveButton';
import NotificationActions from 'actions/NotificationActions';

import LoginStore from 'stores/LoginStore';
import Form, { FormFieldChangeHandler } from 'components/form/Form';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ChildSectionType } from './SettingsMenuDecorator';
import { Location } from 'history';
import IconConstants from 'constants/IconConstants';

export interface SaveDecoratorProps {
  currentMenuItem: ChildSectionType;
  settingsT: UI.ModuleTranslator;
}

export interface SaveDecoratorChildProps {
  saveButton: React.ReactElement<SaveButtonProps> | false;
  message: React.ReactNode;
}

type SaveableRef = Pick<Form, 'save'>;

export interface SaveDecoratorContext {
  onFieldChanged: FormFieldChangeHandler;
  addFormRef: (keys: string[], c: SaveableRef | null) => void;
  getFormRef: (keys: string[]) => SaveableRef;
}

export const SaveDecoratorContext = React.createContext<SaveDecoratorContext | undefined>(
  undefined
);

export interface SaveContextProps {
  saveContext: SaveDecoratorContext;
}

export function withSaveContext<PropsT>(
  Component: React.ComponentType<PropsT & SaveContextProps>
) {
  return function withSaveContext(props: PropsT) {
    return (
      <SaveDecoratorContext.Consumer>
        {(context) => <Component {...props} saveContext={context!} />}
      </SaveDecoratorContext.Consumer>
    );
  };
}

const getFormId = (keys: string[]) => {
  return keys.join('_');
};

export default function <PropsT extends object>(
  Component: React.ComponentType<SaveDecoratorChildProps & PropsT>
) {
  type Props = SaveDecoratorProps & Pick<RouteComponentProps, 'location'> & PropsT;

  class SaveDecorator extends React.Component<React.PropsWithChildren<Props>> {
    static displayName = 'SaveDecorator';

    forms: { [key: string]: SaveableRef } = {};
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
    };

    onSettingsSaved = () => {
      const { translate } = this.props.settingsT;
      NotificationActions.success({
        title: translate('Saving completed'),
        message: translate('Settings were saved successfully'),
      });

      this.forceUpdate();
    };

    handleSave = () => {
      invariant(Object.keys(this.forms).length > 0, 'No forms exist in SaveDecorator');
      const promises = Object.values(this.forms).map((c) => c.save());
      this.changedProperties.clear();

      return Promise.all(promises).then(this.onSettingsSaved);
    };

    hasChanges = () => {
      return this.changedProperties.size > 0;
    };

    promptSave = (nextLocation: Location) => {
      const { currentMenuItem, settingsT } = this.props;
      if (currentMenuItem.noSave) {
        return true;
      }

      // Closing/opening a modal?
      if (
        this.props.location.pathname.includes(nextLocation.pathname) ||
        nextLocation.pathname.includes(this.props.location.pathname)
      ) {
        return true;
      }

      const hasChanges =
        this.hasChanges() && LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT);
      return !hasChanges
        ? true
        : settingsT.t(
            'unsavedChangesPrompt',
            'You have unsaved changes. Are you sure you want to leave?'
          );
    };

    addFormRef = (keys: string[], c: SaveableRef | null) => {
      if (c) {
        invariant(
          c.hasOwnProperty('save'),
          'Invalid setting form component supplied for SaveDecorator (save property missing)'
        );
        this.forms[getFormId(keys)] = c;
      } else {
        // Switching to another page
        // Single forms shouldn't be unmounted otherwise, but using identifiers would still be safer...
        this.forms = {};
      }
    };

    getFormRef = (keys: string[]) => {
      return this.forms[getFormId(keys)];
    };

    saveContext: SaveDecoratorContext = {
      onFieldChanged: this.onSettingsChanged,
      addFormRef: this.addFormRef,
      getFormRef: this.getFormRef,
    };

    render() {
      const { currentMenuItem, children, settingsT } = this.props;

      const message = currentMenuItem.local && (
        <Message
          description={settingsT.t<string>(
            'browserSpecificNote',
            'Settings listed on this page are browser-specific'
          )}
          icon={IconConstants.INFO}
        />
      );

      const saveButton = !currentMenuItem.noSave && (
        <SaveButton
          saveHandler={this.handleSave}
          hasChanges={this.hasChanges()}
          local={currentMenuItem.local}
          settingsT={settingsT}
        />
      );

      return (
        <Component {...this.props} saveButton={saveButton} message={message}>
          <SaveDecoratorContext.Provider value={this.saveContext}>
            <Prompt message={this.promptSave} />
            {children}
          </SaveDecoratorContext.Provider>
        </Component>
      );
    }
  }

  return SaveDecorator;
}
