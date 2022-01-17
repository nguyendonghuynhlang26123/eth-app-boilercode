import { NotificationController } from 'components';
import { mainTheme, providers, globalStyleSx } from 'configs';
import React from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import { ThemeContext, Web3ContextProvider } from './components/context';
import appRoutes from './pages/routes';

function App() {
  const { pathname, search } = useLocation(); // for url params
  const routes = useRoutes(appRoutes(false, search, pathname));

  return (
    <React.Fragment>
      {/* Notification for toastify */}
      <NotificationController />

      <ThemeContext theme={mainTheme} globalStyleSx={globalStyleSx}>
        <Web3ContextProvider providerConfig={providers}>{routes}</Web3ContextProvider>
      </ThemeContext>
    </React.Fragment>
  );
}

export default App;
