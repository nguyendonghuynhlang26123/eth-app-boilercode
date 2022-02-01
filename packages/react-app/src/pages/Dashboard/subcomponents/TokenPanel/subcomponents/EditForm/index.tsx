import { ArrowBack, Close, Save, Sync } from '@mui/icons-material';
import {
  Zoom,
  Stack,
  Typography,
  Button,
  Box,
  TextField,
  Avatar,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { EditFormPropsType, TokenDetails } from './type';
import { useDebounce, useLoading, useWeb3Provider } from 'hooks';
import { containerSx, formSxType } from './style';
import Coin from 'assets/images/coin.svg';
import Utils from 'common/utils';
import { ethers } from 'ethers';

const validationSchema = yup.object({
  address: yup.string().required('Please specify the contract address'),
  symbol: yup.string().required('Please specify the token symbol'),
  image_url: yup.string(),
  decimal: yup.number().min(0).max(18).required('Please specify token decimal'),
});

const abi = ['function symbol() public view returns (string memory)'];

export const EditForm = ({ show, handleBack, handleSave, data }: EditFormPropsType) => {
  const { provider } = useWeb3Provider();
  const [verifying, setVerifying] = useState<boolean>(false);
  const formik = useFormik<TokenDetails>({
    initialValues: data,
    validationSchema: validationSchema,
    validateOnChange: true,
    onSubmit: (values) => {
      verfyContract(values.address).then(() => {
        handleSave(values);
        closeForm();
      });
    },
  });
  const imgUrl = useDebounce(formik.values.image_url, 1000);

  const verfyContract = async (address: string) => {
    if (provider) {
      const result = await Utils.nullIfError(provider.getCode(address));
      if (result === '0x' || !result) {
        formik.setFieldError('address', 'Not found contract for this address');
      } else {
        formik.setStatus('success');

        const contract = new ethers.Contract(address, abi, provider);
        const symbol = await Utils.nullIfError(contract.symbol());

        if (symbol) formik.setFieldValue('symbol', symbol);
      }
    }
  };

  const handleVerifyButtonClick = (address: string) => {
    if (!address) return;
    setVerifying(true);
    verfyContract(address).then(() => {
      setVerifying(false);
    });
  };

  const closeForm = () => {
    formik.resetForm();
    handleBack();
  };

  return (
    <Zoom in={show} appear={true} timeout={500}>
      {formik && (
        <Box sx={containerSx}>
          <Stack justifyContent="space-between">
            <Typography variant="h6">Add a token</Typography>
            <IconButton onClick={closeForm}>
              <Close />
            </IconButton>
          </Stack>

          <Box component="form" noValidate autoComplete="off" sx={formSxType} onSubmit={formik.handleSubmit}>
            <TextField
              id="image_url"
              name="image_url"
              label="Token icon (optional)"
              fullWidth
              value={formik.values.image_url}
              onChange={formik.handleChange}
              error={formik.touched.image_url && Boolean(formik.errors.image_url)}
              helperText={formik.touched.image_url && formik.errors.image_url}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Avatar src={imgUrl}>
                      <img src={Coin} alt="Coin" />
                    </Avatar>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="address"
              name="address"
              label="Contract Address"
              fullWidth
              autoComplete="off"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.address)}
              helperText={formik.errors.address}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" onClick={() => handleVerifyButtonClick(formik.values.address)}>
                      <Tooltip title="Verify contract">{verifying ? <CircularProgress /> : <Sync />}</Tooltip>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="symbol"
              name="symbol"
              label="Token Symbol"
              fullWidth
              autoComplete="off"
              value={formik.values.symbol}
              onChange={formik.handleChange}
              error={formik.touched.symbol && Boolean(formik.errors.symbol)}
              helperText={formik.touched.symbol && formik.errors.symbol}
            />
            <TextField
              id="decimal"
              name="decimal"
              label="Number of Decimal"
              type="number"
              fullWidth
              autoComplete="off"
              value={formik.values.decimal}
              onChange={formik.handleChange}
              error={formik.touched.decimal && Boolean(formik.errors.decimal)}
              helperText={formik.touched.decimal && formik.errors.decimal}
            />

            <Button startIcon={<Save />} type="submit" fullWidth variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      )}
    </Zoom>
  );
};
