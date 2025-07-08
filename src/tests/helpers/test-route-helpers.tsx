import Button from '@/components/semantic/Button';
import { useNavigate } from 'react-router';

interface TestRouteNavigateButtonProps {
  caption: string;
  route: string;
}

export const TestRouteNavigateButton = ({
  caption,
  route,
}: TestRouteNavigateButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button
      caption={caption}
      onClick={() => {
        navigate(route);
      }}
    />
  );
};

export const NavigateBackCaption = 'Navigate back';

interface TestNavigateBackButtonProps {
  caption?: string;
}

export const TestNavigateBackButton = ({
  caption = NavigateBackCaption,
}: TestNavigateBackButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button
      caption={caption}
      onClick={() => {
        navigate(-1);
      }}
    />
  );
};

export const NavigateForwardCaption = 'Navigate forward';

interface TestNavigateForwardButtonProps {
  caption?: string;
}

export const TestNavigateForwardButton = ({
  caption = NavigateBackCaption,
}: TestNavigateForwardButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button
      caption={caption}
      onClick={() => {
        navigate(1);
      }}
    />
  );
};
