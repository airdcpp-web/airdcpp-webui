import * as React from 'react';
import classNames from 'classnames';

import { MentionsInput, Mention, DataFunc } from 'react-mentions';
import Dropzone, { DropzoneRef } from 'react-dropzone';

import { usingMobileLayout } from '@/utils/BrowserUtils';

import UserConstants from '@/constants/UserConstants';

import * as API from '@/types/api';
import * as UI from '@/types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import FilePreviewDialog from './FilePreviewDialog';
import TempShareDropdown, { TempShareDropdownProps } from './TempShareDropdown';
import { translate } from '@/utils/TranslationUtils';
import Icon from '@/components/semantic/Icon';
import Button from '@/components/semantic/Button';
import IconConstants from '@/constants/IconConstants';
import { useFileUploader } from './effects/useChatFileUploader';
import { useMessageComposer } from './effects/useMessageComposer';
import { useSocket } from '@/context/SocketContext';
import { useSession } from '@/context/AppStoreContext';
import { hasAccess } from '@/utils/AuthUtils';

const getMentionFieldStyle = (mobileLayout: boolean) => {
  return {
    suggestions: {
      list: {
        width: 200,
        overflow: 'auto',
        position: 'absolute',
        bottom: 3,
        left: 17,
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,0.15)',
        fontSize: 10,
      } as React.CSSProperties,

      item: {
        padding: '5px 15px',
        borderBottom: '1px solid rgba(0,0,0,0.15)',

        '&focused': {
          background: 'rgba(0,0,0,.03)',
          color: 'rgba(0,0,0,.95)',
        },
      },
    },
    highlighter: {
      minHeight: !mobileLayout ? 63 : 42,
      maxHeight: 200,
      margin: 0,
    },
    input: {
      minHeight: !mobileLayout ? 63 : 42,
      maxHeight: 200,
      margin: 0,

      // Disable weird hack from react-mentions which breaks styling on iOS
      // eslint-disable-next-line max-len
      // https://github.com/signavio/react-mentions/blob/e2b0273d4a629af8107ba1738f0a5846ada790f1/src/MentionsInput.js#L1033
      marginLeft: 0,
      marginTop: 0,
    },
  };
};

export interface MessageComposerProps
  extends UI.ChatController,
    Pick<TempShareDropdownProps, 'dropdownContext'> {
  t: UI.TranslateF;
}

const userToMention = (user: API.HubUser) => {
  return {
    id: user.cid,
    display: user.nick,
  };
};

export const MessageComposer: React.FC<MessageComposerProps> = (props) => {
  const session = useSession();
  const dropzoneRef = React.useRef<DropzoneRef>(null);
  const socket = useSocket();

  const { t, handleFileUpload, dropdownContext } = props;

  const { appendText, sendText, text, onTextChanged, onKeyDown } = useMessageComposer({
    chatController: props,
    t,
  });

  const { uploading, onDropFile, onPaste, onUploadFiles, files, resetFiles } =
    useFileUploader({ appendText, handleFileUpload: handleFileUpload, t });

  const findUsers: DataFunc = (value, callback) => {
    const { hubUrl } = props;
    socket
      .post(UserConstants.SEARCH_NICKS_URL, {
        pattern: value,
        max_results: 5,
        hub_urls: hubUrl ? [hubUrl] : undefined,
      })
      .then((users: API.HubUser[]) => callback(users.map(userToMention)))
      .catch((error: ErrorResponse) =>
        console.log(`Failed to fetch suggestions: ${error.message}`),
      );
  };

  const mobile = usingMobileLayout();
  const className = classNames('ui form composer', { small: mobile }, { large: !mobile });

  const hasFileUploadAccess =
    hasAccess(session, API.AccessEnum.FILESYSTEM_EDIT) &&
    hasAccess(session, API.AccessEnum.SHARE_EDIT);

  const sendButton = (
    <Button
      className="large icon send"
      onClick={sendText}
      caption={<Icon icon={IconConstants.SEND} />}
      loading={uploading}
      color="blue"
      aria-label="Send message"
    />
  );

  return (
    <>
      {!!files && (
        <FilePreviewDialog
          files={files}
          onConfirm={onUploadFiles}
          onReject={resetFiles}
          title={translate('Send files', t, UI.Modules.COMMON)}
        />
      )}
      <Dropzone
        onDrop={onDropFile}
        ref={dropzoneRef}
        disabled={!hasFileUploadAccess}
        multiple={true}
        minSize={1}
        noClick={true}
        // Handle max size check elsewhere (report errors)
      >
        {({ getRootProps, getInputProps, open }) => (
          <div className={className} {...getRootProps()}>
            <input data-testid="dropzone" {...getInputProps()} />
            <MentionsInput
              className="input"
              value={text}
              onChange={onTextChanged}
              onKeyDown={onKeyDown}
              style={getMentionFieldStyle(mobile)}
              autoFocus={!mobile}
              onPaste={onPaste}
            >
              <Mention trigger="@" data={findUsers} appendSpaceOnAdd={false} />
            </MentionsInput>
            {!hasFileUploadAccess || uploading ? (
              sendButton
            ) : (
              <TempShareDropdown
                className="blue large"
                handleUpload={open}
                overrideContent={!text ? null : sendButton}
                dropdownContext={dropdownContext}
              />
            )}
          </div>
        )}
      </Dropzone>
    </>
  );
};
