import * as React from 'react';
import classNames from 'classnames';

import { MentionsInput, Mention, OnChangeHandlerFunc } from 'react-mentions';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { loadSessionProperty, saveSessionProperty, useMobileLayout } from 'utils/BrowserUtils';
import ChatCommandHandler from './ChatCommandHandler';
import NotificationActions from 'actions/NotificationActions';

import UserConstants from 'constants/UserConstants';
import SocketService from 'services/SocketService';
import { ChatLayoutProps } from 'routes/Sidebar/components/chat/ChatLayout';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { ErrorResponse } from 'airdcpp-apisocket';
import FilePreviewDialog from './FilePreviewDialog';
import TempShareDropdown from './TempShareDropdown';
import { TFunction } from 'i18next';
import { translate, toI18nKey } from 'utils/TranslationUtils';
import { formatSize } from 'utils/ValueFormat';
import LoginStore from 'stores/LoginStore';
import AccessConstants from 'constants/AccessConstants';
import Icon from 'components/semantic/Icon';
import Button from 'components/semantic/Button';
import IconConstants from 'constants/IconConstants';

const ENTER_KEY_CODE = 13;


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
      },

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
      // tslint:disable-next-line:max-line-length
      // https://github.com/signavio/react-mentions/blob/e2b0273d4a629af8107ba1738f0a5846ada790f1/src/MentionsInput.js#L1033
      marginLeft: 0,
      marginTop: 0,
    },
  };
};

export interface MessageComposerProps extends 
  Pick<ChatLayoutProps, 'chatApi' | 'session' | 'chatActions' | 'handleFileUpload'> {

  t: TFunction;
}

const getStorageKey = (props: RouteComponentProps) => {
  return `last_message_${props.location.pathname}`;
};

const loadState = (props: RouteComponentProps) => {
  return {
    text: loadSessionProperty(getStorageKey(props), ''),
  };
};


const saveState = (state: State, props: RouteComponentProps) => {
  saveSessionProperty(getStorageKey(props), state.text);
};

const userToMention = (user: API.HubUser) => {
  return {
    id: user.cid,
    display: user.nick,
  };
};

interface State {
  text: string;
  files: File[] | null;
  uploading: boolean;
}

class MessageComposer extends React.Component<MessageComposerProps & RouteComponentProps> {
  /*static propTypes = {
    // Actions for this chat session type
    actions: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
  };*/

  dropzoneRef = React.createRef<DropzoneRef>();

  handleCommand = (text: string) => {
    const { location } = this.props;

    let command, params;

    {
      // Parse the command
      const whitespace = text.indexOf(' ');
      if (whitespace === -1) {
        command = text.substr(1);
      } else {
        command = text.substr(1, whitespace - 1);
        params = text.substr(whitespace + 1);
      }
    }

    ChatCommandHandler(this.props).handle(command, params, location);
  }

  handleSend = (text: string) => {
    const { chatApi, session } = this.props;
    chatApi.sendChatMessage(session, text);
  }

  componentWillUnmount() {
    saveState(this.state, this.props);
  }

  componentDidUpdate(prevProps: RouteComponentProps, prevState: State) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      saveState(prevState, prevProps);
      this.setState(loadState(this.props));
    }
  }

  handleChange: OnChangeHandlerFunc = (event, markupValue, plainValue) => {
    this.setState({ 
      text: plainValue 
    });
  }

  onKeyDown = (event: React.KeyboardEvent) => {
    if (event.keyCode === ENTER_KEY_CODE && !event.shiftKey) {
      event.preventDefault();
      this.sendText();
    }
  }

  sendText = () => {
    // Trim only from end to allow chat messages such as " +help" to be
    // sent to other users
    // This will also prevent sending empty messages
    const text = this.state.text.replace(/\s+$/, '');

    if (text) {
      if (text[0] === '/') {
        this.handleCommand(text);
      }

      this.handleSend(text);
    }

    this.setState({ text: '' });
  }

  findUsers = (value: string, callback: (data: any) => void) => {
    const { session } = this.props;
    SocketService.post(UserConstants.SEARCH_NICKS_URL, { 
      pattern: value, 
      max_results: 5,
      hub_urls: session.hub_url ? [ session.hub_url ] : undefined,
    })
      .then((users: API.HubUser[]) => callback(users.map(userToMention)))
      .catch((error: ErrorResponse) => 
        console.log(`Failed to fetch suggestions: ${error}`)
      );
  }
  
  appendText = (text: string) => {
    let newText = this.state.text;
    if (newText) {
      newText += ' ';
    }
    newText += text;

    this.setState({
      text: newText
    });
  }

  onDropFile = (acceptedFiles: File[]) => {
    const { t } = this.props;
    const maxSize = 100 * 1024 * 1024;

    const files = acceptedFiles
      .filter(file => {
        if (file.size > maxSize) {
          NotificationActions.error({
            title: file.name,
            message: t(toI18nKey('fileTooLarge', UI.Modules.COMMON), {
              defaultValue: 'File is too large (maximum size is {{maxSize}})',
              replace: {
                maxSize: formatSize(maxSize, t)
              }
            })
          });
    
          return false;
        }

        return true;
      });

    if (!files.length) {
      return;
    }

    this.setState({
      files
    });
  }

  onUploadFiles = async (files: File[]) => {
    this.resetFiles();
    this.setState({
      uploading: true
    });

    const { handleFileUpload } = this.props;
    for (let file of files) {
      try {
        const res = await handleFileUpload(file);
        this.appendText(res.magnet);
      } catch (e) {
        NotificationActions.apiError('Failed to upload the file', e);
      }
    }

    this.setState({
      uploading: false
    });
  }

  onPaste = (evt: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (evt.clipboardData && evt.clipboardData.files && (evt.clipboardData as any).files.length) {
      let files: File[] = [];

      {
        // DataTransferItemList isn't a normal array, convert it first
        // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItemList
        const dataTransferItemList = (evt.clipboardData as any).files as any[];
        for (let i = 0; i < dataTransferItemList.length; i++) {
          files.push(dataTransferItemList[i]);
        }
      }

      evt.preventDefault();
      this.onDropFile(files);
    }
  }

  resetFiles = () => {
    this.setState({
      files: null,
    });
  }

  state: State = {
    ...loadState(this.props),
    files: null,
    uploading: false,
  };

  render() {
    const mobile = useMobileLayout();
    const className = classNames(
      'ui form composer',
      { small: mobile },
      { large: !mobile },
    );

    const hasFileUploadAccess = LoginStore.hasAccess(AccessConstants.FILESYSTEM_EDIT) && 
      LoginStore.hasAccess(AccessConstants.SETTINGS_EDIT);

    const { files, text, uploading } = this.state;
    const { t } = this.props;

    const sendButton = (
      <Button 
        className="blue large icon send" 
        onClick={ this.sendText }
        caption={ <Icon icon={ IconConstants.SEND }/> }
        loading={ uploading }
      />
    );

    return (
      <>
        { !!files && (
          <FilePreviewDialog
            files={ files }
            onConfirm={ this.onUploadFiles }
            onReject={ this.resetFiles }
            title={ translate('Send files', t, UI.Modules.COMMON) }
          />
        ) }
        <Dropzone
          onDrop={ this.onDropFile }
          ref={ this.dropzoneRef }
          disabled={ !hasFileUploadAccess }
          multiple={ true }
          minSize={ 1 }
          noClick={ true }
          // Handle max size check elsewhere (report errors)
        >
          {({ getRootProps, getInputProps, open }) => (
            <div 
              className={ className }
              { ...getRootProps() }
            >
              <input 
                { ...getInputProps() }
              />
              <MentionsInput 
                className="input"
                value={ text } 
                onChange={ this.handleChange }
                onKeyDown={ this.onKeyDown }
                style={ getMentionFieldStyle(mobile) }
                autoFocus={ !mobile }
                onPaste={ this.onPaste }
              >
                <Mention 
                  trigger="@"
                  data={ this.findUsers }
                  appendSpaceOnAdd={ false }
                />
              </MentionsInput>
              { !hasFileUploadAccess || uploading ? sendButton : (
                <TempShareDropdown
                  className="blue large" 
                  handleUpload={ open }
                  overrideContent={ !text ? null : sendButton }
                />
              ) }
            </div>
          ) }
        </Dropzone>
      </>
    );
  }
}

const Decorated = withRouter(MessageComposer);

export default Decorated;