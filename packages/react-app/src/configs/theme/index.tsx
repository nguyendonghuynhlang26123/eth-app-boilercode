// material
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import shape from './shape';
import palette from './pallete';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadow';
import globalStyle from './globalStyle';
// ----------------------------------------------------------------------

const themeOptions = {
  palette,
  shape,
  typography,
  shadows,
  customShadows,
};
const theme = createTheme(themeOptions as any);
theme.components = componentsOverride(theme);

export const mainTheme = theme;
export const globalStyleSx = globalStyle;
