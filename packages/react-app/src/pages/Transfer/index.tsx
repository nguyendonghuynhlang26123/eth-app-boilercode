import { Box, Stepper, Paper, Step, StepLabel } from '@mui/material';
import { AppBreadcrumbs } from 'components';
import React from 'react';

const SendForm = () => {
  const steps = ['Select master blaster campaign settings', 'Create an ad group', 'Create an ad'];
  return (
    <Box>
      <AppBreadcrumbs title="Transfer assets" list={[{ label: 'Home', href: '/' }]} label="Common operations" />
      <Paper sx={{ p: 2 }}>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default SendForm;
