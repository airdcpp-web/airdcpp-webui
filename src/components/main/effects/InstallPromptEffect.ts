import { useEffect, useState } from 'react';


// This must on the top level so that we are able to catch the
// "beforeinstallprompt" event when it's being fired
const useInstallPrompt = () => {
  const [ prompt, setPrompt ] = useState<null | Event>(null);

  useEffect(
    () => {
      function handleBeforeInstallPrompt(e: Event) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        setPrompt(e);

        //console.log(`beforeinstallprompt`, e);
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    },
    []
  );

  return !prompt ? null : () => {
    (prompt as any).prompt();
    setPrompt(null);
  };
};

export { useInstallPrompt };
