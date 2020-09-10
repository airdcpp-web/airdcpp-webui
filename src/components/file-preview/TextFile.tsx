'use strict';
import React, { useEffect, useState } from 'react';

import { TextDecorator } from 'components/text';
import Message from 'components/semantic/Message';

import * as UI from 'types/ui';
import { translate } from 'utils/TranslationUtils';
import { useTranslation } from 'react-i18next';
import Loader from 'components/semantic/Loader';


interface TextFileProps {
  textGetter: () => Promise<string>;
  url?: string;
}

const TextFile: React.FC<TextFileProps> = ({ textGetter, url }) => {
  const [ text, setText ] = useState<string | null>(null);
  const [ error, setError ] = useState<Error | null>(null);

  const { t } = useTranslation();
  useEffect(
    () => {
      textGetter()
        .then(setText)
        .catch(setError);

      return () => {
        setText(null);
        setError(null);
      };
    },
    [ url ]
  );

  if (!text) {
    if (error) {
      return (
        <Message
          title={ translate('Failed to fetch content', t, UI.Modules.COMMON) }
          description={ error.message }
        />
      );
    }

    return <Loader/>;
  }

  return (
    <pre>
      <TextDecorator
        text={ text }
      />
    </pre>
  );
};

export { TextFile };
