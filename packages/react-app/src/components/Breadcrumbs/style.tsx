import { SxType } from 'common/type';

export const breadcrumbSx: SxType = {
  pt: 6,
  pb: 2,
  '& .breadcumbs-header': {
    fontSize: 26,
    fontWeight: 500,
    mt: 0,
  },

  '& .MuiBreadcrumbs-root': {
    fontSize: 16,

    '& .MuiTypography-root': {},

    '& .MuiBreadcrumbs-separator': {
      mx: 1,
      fontSize: 10,
    },
  },
};
