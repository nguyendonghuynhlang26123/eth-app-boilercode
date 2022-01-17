import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { InfoCardProps } from './type';

export const InfoCard = ({ bgcolor, color, icon, title, fetchData }: InfoCardProps) => {
  const [value, setValue] = React.useState<string>('-');
  React.useEffect(() => {
    if (fetchData) fetchData().then((data: string) => setValue(data));
  }, [fetchData]);
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ bgcolor, color, borderRadius: 4, width: 250, height: 200, px: 4 }}
    >
      <Box
        sx={{
          display: 'flex',
          borderRadius: '50%',
          border: 2,
          borderColor: color,
          alignItems: 'center',
          width: 48,
          height: 48,
          p: 0.5,
          mb: 2,
          justifyContent: 'center',
          color: color,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h4" noWrap component="div">
        {value}
      </Typography>
      <Typography variant="body1">{title}</Typography>
    </Stack>
  );
};
