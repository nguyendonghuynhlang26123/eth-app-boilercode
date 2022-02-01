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
      sx={{ bgcolor, color, borderRadius: 4, flex: 1, height: 150, px: 4, boxShadow: 1 }}
    >
      <Box
        sx={{
          display: 'flex',
          borderRadius: '50%',
          border: 2,
          borderColor: color,
          alignItems: 'center',
          width: 40,
          height: 40,
          p: 0.5,
          mb: 1,
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
