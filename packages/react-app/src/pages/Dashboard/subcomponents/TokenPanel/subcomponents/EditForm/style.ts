import { SxType } from 'common/type';

export const containerSx: SxType = {
  position: 'absolute',
  width: '100%',
  minHeight: '100%',
  top: 0,
  left: 0,
  bgcolor: 'background.default',
  p: 3,
  boxShadow: 1,
};
export const formSxType: SxType = {
  mt: 2,
  mb: 1,
  '& .MuiTextField-root': { my: 1 },

  '& .MuiAvatar-root': {
    width: 32,
    height: 32,
    '& img': {
      width: '100%',
      height: '100%',
    },
  },
};
