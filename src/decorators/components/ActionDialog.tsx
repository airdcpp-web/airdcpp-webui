// import * as React from 'react';

// import { Location } from 'react-router-dom';

import * as UI from 'types/ui';

import { ConfirmDialog, ConfirmDialogProps } from 'components/semantic/ConfirmDialog';
import { InputDialog } from 'components/semantic/InputDialog';
import { useTranslation } from 'react-i18next';
import { translate, toI18nKey, toArray } from 'utils/TranslationUtils';

import { upperFirst } from 'lodash';
import { translateActionName } from 'utils/ActionUtils';

export interface ActionData<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  action: UI.ActionDefinition<ItemDataT, EntityT>;
  itemData: ItemDataT;
  entity: EntityT;
  moduleData: UI.ActionModuleData;
}

// Get an actions-specific translation key with the given suffix
export const suffixActionI18nKey = (
  fieldSuffix: string,
  actionData: ActionData<any, any>,
  subNameSpace: UI.SubNamespaces,
) => {
  const { moduleId, subId } = actionData.moduleData;

  let keyName = actionData.action.id;
  if (subId) {
    keyName += upperFirst(subId);
  }

  keyName += upperFirst(fieldSuffix);

  return toI18nKey(keyName, [
    ...toArray(moduleId),
    UI.SubNamespaces.ACTIONS,
    subNameSpace,
  ]);
};

const translateInput = (
  input: UI.ActionConfirmation,
  actionData: ActionData<any, any>,
  t: UI.TranslateF,
): UI.ActionConfirmation => {
  const { approveCaption, rejectCaption, checkboxCaption, content } = input;

  const ret = {
    approveCaption: t(
      suffixActionI18nKey('Approve', actionData, UI.SubNamespaces.PROMPTS),
      approveCaption,
      {
        replace: {
          item: actionData.itemData,
        },
      },
    ),
    rejectCaption: !rejectCaption
      ? undefined
      : t(
          suffixActionI18nKey('Reject', actionData, UI.SubNamespaces.PROMPTS),
          rejectCaption,
        ),
    checkboxCaption: !checkboxCaption
      ? undefined
      : t(
          suffixActionI18nKey('Checkbox', actionData, UI.SubNamespaces.PROMPTS),
          checkboxCaption,
        ),
    content: t(suffixActionI18nKey('Content', actionData, UI.SubNamespaces.PROMPTS), {
      defaultValue: content,
      replace: {
        item: actionData.itemData,
      },
    }),
  };

  return ret;
};

const getCommonConfirmDialogProps = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>(
  actionData: ActionData<ItemDataT, EntityT>,
  confirmation: UI.ActionConfirmation,
  defaultRejectCaption: string,
  t: UI.TranslateF,
): Omit<ConfirmDialogProps, 'onApproved'> => {
  const { action, moduleData } = actionData;
  const { icon } = action;
  const { approveCaption, rejectCaption, content, checkboxCaption } = translateInput(
    confirmation!,
    actionData,
    t,
  );
  return {
    approveCaption,
    rejectCaption: rejectCaption || translate(defaultRejectCaption, t, UI.Modules.COMMON),
    content,
    icon,
    title: translateActionName(action, moduleData, t),
    checkboxCaption,
  };
};

interface ConfirmHandlerProps<
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
> {
  onApproved: (data: boolean | string) => Promise<void>;
  onRejected: () => void;
  actionData: ActionData<ItemDataT, EntityT> | null;
}

export const ActionDialog = <
  ItemDataT extends UI.ActionDataValueType,
  EntityT extends UI.ActionEntityValueType,
>({
  actionData,
  onApproved,
  onRejected,
}: ConfirmHandlerProps<ItemDataT, EntityT>) => {
  const { t } = useTranslation();
  if (!actionData) {
    return null;
  }

  const { confirmation, input } = actionData.action;
  if (confirmation) {
    const options =
      typeof confirmation === 'object'
        ? confirmation
        : confirmation(actionData.itemData!);
    return (
      <ConfirmDialog
        onApproved={onApproved}
        onRejected={onRejected}
        {...getCommonConfirmDialogProps(actionData, options, 'No', t)}
      />
    );
  }

  if (input) {
    const options = typeof input === 'object' ? input : input(actionData.itemData!);
    if (options.inputProps.placeholder) {
      options.inputProps.placeholder = t(
        suffixActionI18nKey('Placeholder', actionData, UI.SubNamespaces.PROMPTS),
        options.inputProps.placeholder,
      );
    }

    return (
      <InputDialog
        onApproved={onApproved}
        onRejected={onRejected}
        inputProps={options.inputProps}
        {...getCommonConfirmDialogProps(actionData, options, 'Cancel', t)}
      />
    );
  }

  return null;
};
