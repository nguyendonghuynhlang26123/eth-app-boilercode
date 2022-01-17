import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import React from 'react';
import { CssBaseline } from '@mui/material';
import { MultipleSxTypes } from 'common/type';

type ThemeCtxProps = {
  children: any;
  theme: any;
  globalStyleSx: (theme: any) => any;
};

export const ThemeContext = ({ children, theme, globalStyleSx }: ThemeCtxProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ...globalStyleSx(theme),
          }}
        />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
