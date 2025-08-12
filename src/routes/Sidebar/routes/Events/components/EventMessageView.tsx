import * as React from 'react';

import Loader from '@/components/semantic/Loader';

import Message from '@/components/semantic/Message';
import MessageView from '@/components/messages/MessageView';

import '../style.css';

import * as UI from '@/types/ui';
import { translate } from '@/utils/TranslationUtils';
import { useSessionStoreProperty } from '@/context/SessionStoreContext';

interface EventMessagesProps {
  messages: UI.MessageListItem[] | undefined;
  t: UI.TranslateF;
}

const EventMessageView: React.FC<EventMessagesProps> = ({ messages, t }) => {
  const scrollHandler = useSessionStoreProperty((state) => state.events.scroll);
  if (!messages) {
    return <Loader text={translate('Loading messages', t, UI.Modules.EVENTS)} />;
  }

  if (messages.length === 0) {
    return (
      <Message description={translate('No messages to show', t, UI.Modules.EVENTS)} />
    );
  }

  return (
    <MessageView
      className="events"
      messages={messages}
      scrollPositionHandler={scrollHandler}
      t={t}
    />
  );
};

export default EventMessageView;
