import { RouteConfigs } from 'common/type';
import { Navigate } from 'react-router-dom';
import React from 'react';
import { LinearProgress } from '@mui/material';

const MainLayout = React.lazy(() => import('./MainLayout'));
// main screen
const Dashboard = React.lazy(() => import('./Dashboard'));
const Transfer = React.lazy(() => import('./Transfer'));

//Error pages
const NotFoundPage = React.lazy(() => import('./Errors/NotFound'));

// Public wrapper
const Wrapper = ({ children }: { children: any }) => <React.Suspense fallback={<LinearProgress />}>{children}</React.Suspense>;

// Connected wrapper

const appRoutes = (isConnected: boolean, search: string, pathname: string): RouteConfigs => {
  const routes: RouteConfigs = [
    /// Authed routes
    {
      element: (
        <Wrapper>
          <MainLayout />
        </Wrapper>
      ), //Wrap by auth checking
      children: [
        {
          path: '/',
          index: true,
          element: <Dashboard />,
        },
        {
          path: 'common/transfer',
          element: <Transfer />,
        },
      ],
    },

    //Error handler
    {
      path: '/not-found',
      element: (
        <Wrapper>
          <NotFoundPage />
        </Wrapper>
      ),
    },
    {
      path: '/*',
      element: <Navigate to="/not-found" />,
    },
  ];

  return routes;
};

export default appRoutes;
