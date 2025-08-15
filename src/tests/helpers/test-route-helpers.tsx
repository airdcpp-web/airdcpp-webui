import { useStoreDataFetch } from '@/components/main/effects/StoreDataFetchEffect';
import Button from '@/components/semantic/Button';
import { Outlet, RouteObject, useNavigate } from 'react-router';

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

export const createDataFetchRoutes = (
  children: RouteObject[],
  indexChildren: React.ReactNode = null,
) => {
  const DataFetchWrapper: React.FC = () => {
    useStoreDataFetch(true);
    return <Outlet />;
  };

  const IndexPage = () => {
    return (
      <>
        <div>Index page</div>
        {indexChildren}
      </>
    );
  };

  const routes: RouteObject[] = [
    {
      path: '/',
      Component: DataFetchWrapper,
      children: [
        {
          index: true,
          Component: IndexPage,
        },
        ...children,
      ],
    },
  ];

  return routes;
};
