import { blue } from '@mui/material/colors';
import { MultipleSxTypes } from 'common/type';

const drawerWidth = 300;
const headerHeight = 64;

export const navbarLayoutSx: MultipleSxTypes = {
  root: {
    display: 'flex',
  },

  appbar: { width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, zIndex: 1 },

  toolbar: {
    bgcolor: 'background.paper',
    color: 'text.primary',
    justifyContent: 'flex-end',
    borderBottom: 1,
    borderColor: 'divider',
    '& .MuiAvatar-root': {
      overflow: 'hidden',
      bgcolor: 'white',
      border: 2,
      borderColor: 'divider',
      mx: 1,
      width: 32,
      height: 32,
    },
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    px: 2,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      zIndex: 1,
    },
    '& .MuiListItem-root': {
      p: 0,
    },

    '& .MuiToolbar-root': {
      display: 'flex',
      gap: 1,
      alignItems: 'center',
    },
  },

  btnItem: {
    fontWeight: 500,
    fontSize: 16,
    height: 56,

    ':hover': {
      color: 'primary.main',
    },

    '&.active': {
      bgcolor: 'primary.lighter',
      color: 'primary.dark',
      borderRight: 3,
      borderColor: 'primary.main',
      '& span': {
        fontWeight: 600,
      },
    },
  },

  main: {
    flexGrow: 1,
    bgcolor: 'background.neutral',
    px: 3,
    mt: `${headerHeight}px`,
    minHeight: `calc(100vh - ${headerHeight}px)`,

    '& .breadcumbs-header': {
      fontSize: 20,
      fontWeight: 500,
      mt: 4,
    },

    '& .MuiBreadcrumbs-root': {
      fontSize: 14,

      '& .MuiTypography-root': {},

      '& .MuiBreadcrumbs-separator': {
        mx: 1,
        fontSize: 10,
      },
    },
  },

  accordionItem: {
    boxShadow: 0,
    width: '100%',
    p: 0,
    '& .MuiAccordionDetails-root': { p: 0 },
  },

  title: {
    fontWeight: 500,
    fontSize: 14,
    color: 'grey.800',
    letterSpacing: '.2px',
  },
};
