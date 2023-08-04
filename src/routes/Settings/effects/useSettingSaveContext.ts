import * as React from 'react';
import invariant from 'invariant';

import NotificationActions from 'actions/NotificationActions';

import Form, { FormFieldChangeHandler } from 'components/form/Form';

import * as UI from 'types/ui';

import { ChildSectionType } from '../types';
// import { unstable_useBlocker, useLocation } from 'react-router';

type SaveableRef = Pick<Form, 'save'>;

export interface SettingSaveContext {
  onFieldChanged: FormFieldChangeHandler;
  addFormRef: (keys: string[], c: SaveableRef | null) => void;
  getFormRef: (keys: string[]) => SaveableRef;
}

export const SettingSaveContext = React.createContext<SettingSaveContext | undefined>(
  undefined,
);

export interface SettingSaveState {
  handleSave: () => Promise<void>;
  hasChanges: boolean;

  local: boolean | undefined;
}

export interface SettingSaveContextProps {
  saveContext: SettingSaveContext;
}

const getFormId = (keys: string[]) => {
  return keys.join('_');
};

interface UseSaveContextProps {
  selectedChildMenuItem: ChildSectionType;
  settingsT: UI.ModuleTranslator;
}

export const useSettingSaveContext = ({
  settingsT,
  selectedChildMenuItem,
}: UseSaveContextProps) => {
  const forms = React.useMemo(() => new Map<string, SaveableRef>(), []);
  const [changedProperties, setChangedProperties] = React.useState<string[]>([]);
  //const hasEditAccess =
  //  currentMenuItem.local || LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT);

  React.useEffect(() => {
    setChangedProperties([]);
  }, [selectedChildMenuItem.url]);

  const onSettingsChanged: FormFieldChangeHandler = (id, value, hasChanges) => {
    if (hasChanges) {
      setChangedProperties([...changedProperties, id]);
    } else {
      setChangedProperties(changedProperties.filter((prop) => prop !== id));
    }
  };

  const onSettingsSaved = () => {
    const { translate } = settingsT;
    NotificationActions.success({
      title: translate('Saving completed'),
      message: translate('Settings were saved successfully'),
    });
  };

  const handleSave = async () => {
    invariant(forms.size > 0, 'No forms exist in SaveDecorator');
    const promises = Array.from(forms.values()).map((c) => c.save());

    await Promise.all(promises);
    setChangedProperties([]);

    onSettingsSaved();
  };

  const hasChanges = changedProperties.length > 0;

  /*const location = useLocation();
  unstable_useBlocker(({ currentLocation, nextLocation, historyAction }) => {
    if (selectedChildMenuItem.noSave) {
      return true;
    }

    // Closing/opening a modal?
    if (
      location.pathname.includes(nextLocation.pathname) ||
      nextLocation.pathname.includes(location.pathname)
    ) {
      return true;
    }

    if (!hasChanges) {
      true;
    }

    //const hasChanges =
    //  this.hasChanges() && LoginStore.hasAccess(API.AccessEnum.SETTINGS_EDIT);

    const message = settingsT.t(
      'unsavedChangesPrompt',
      'You have unsaved changes. Are you sure you want to leave?'
    );

    const answer = window.confirm(message);
    return !answer;
  });*/

  const addFormRef = (keys: string[], c: SaveableRef | null) => {
    if (c) {
      invariant(
        c.hasOwnProperty('save'),
        'Invalid setting form component supplied for SaveDecorator (save property missing)',
      );
      forms.set(getFormId(keys), c);
    } else {
      // Switching to another page
      // Single forms shouldn't be unmounted otherwise, but using identifiers would still be safer...
      forms.clear();
    }
  };

  const getFormRef = (keys: string[]) => {
    return forms.get(getFormId(keys))!;
  };

  const saveContext: SettingSaveContext = {
    onFieldChanged: onSettingsChanged,
    addFormRef: addFormRef,
    getFormRef: getFormRef,
  };

  const saveState: SettingSaveState = {
    handleSave,
    hasChanges,

    local: selectedChildMenuItem.local,
  };

  return {
    saveContext,
    saveState,
  };
};
