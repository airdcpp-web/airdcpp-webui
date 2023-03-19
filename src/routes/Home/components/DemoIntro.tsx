import ExternalLink from 'components/ExternalLink';
import LinkConstants from 'constants/LinkConstants';
import Message from 'components/semantic/Message';

const DemoIntro = () => {
  if (process.env.DEMO_MODE !== '1') {
    return null;
  }

  return (
    <Message
      title="Welcome to AirDC++ Web Demo"
      description={
        <div className="demo-message">
          <p>
            Edit permissions are limited in order to keep the content somewhat persistent.
          </p>
          <p>
            Note that this is a locally installed application that is usually run by a
            single user. Most changes, such as browsing of filelists, are propagated to
            all active sessions.
          </p>
          <p>
            Please visit the{' '}
            <ExternalLink url={LinkConstants.HOME_PAGE_URL}>home page</ExternalLink> for
            more information about the client and its features.
          </p>
        </div>
      }
    />
  );
};

export default DemoIntro;
