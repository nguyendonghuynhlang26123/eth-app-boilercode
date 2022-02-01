import { SxType } from 'common/type';

export const gridContainerSx: SxType = {
  width: '100%',
  m: 0,
  p: 0,
  '& .MuiBox-root.panel': {
    bgcolor: 'background.default',
    m: 0,
    p: 3,
    borderRadius: 2,
    boxShadow: 1,
    height: 500,
    overflow: 'auto',
    position: 'relative',
  },
  '& .MuiGrid-item:first-of-type': { pl: '0 !important' },
};
