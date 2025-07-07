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
