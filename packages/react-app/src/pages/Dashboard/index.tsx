import React, { useCallback } from 'react';
import { ethers } from 'ethers';
import { Stack, Typography, Box, Grid, Divider, Button } from '@mui/material';
import { colors } from '@mui/material';
import { InfoCard } from './subcomponents';
import { SiEthereum } from 'react-icons/si';
import { FaMoneyBill } from 'react-icons/fa';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { GiChaingun } from 'react-icons/gi';
import { AppBreadcrumbs } from 'components';
import { useUsdPrice, useWeb3Provider } from 'hooks';
import { Add, Refresh } from '@mui/icons-material';
import { gridContainerSx } from './style';
import { TokenPanel } from './subcomponents/TokenPanel';
import { TransferHistory } from './subcomponents/TransactionPanel';
import Utils from 'common/utils';

function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes('.')) {
    const parts = str.split('.');
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}
const prettyNum = (b: ethers.BigNumberish) => truncate(ethers.utils.formatEther(b), 2);

interface SelectedContract {
  symbol: string;
  address: string;
}

const Dashboard = () => {
  const { provider, account, ens, signer } = useWeb3Provider();
  const [usd] = useUsdPrice();
  const [selectedToken, setSelectedToken] = React.useState<SelectedContract>();

  const fetchChainId = useCallback(async () => {
    if (provider) {
      const result = await provider.getNetwork();
      return `${result.name} (${result.chainId})`;
    } else return '-';
  }, [provider]);

  const fetchAddress = async () => {
    return ens || '-';
  };

  const fetchBalance = useCallback(async () => {
    if (provider && account) {
      let result = await provider.getBalance(account);
      return prettyNum(result) + ' ETH';
    } else return '-';
  }, [provider]);

  const fetchUsdPrice = async () => {
    if (usd) return usd + '$ / ETH';
    else return '-';
  };

  return (
    <Box>
      <AppBreadcrumbs title="Home" list={[]} label="Dashboard" />
      <Stack direction="row" spacing={2}>
        <InfoCard
          color={colors.blue[600]}
          bgcolor={colors.blue[50]}
          title="Chain Info"
          icon={<GiChaingun size="1.6em" />}
          fetchData={fetchChainId}
        />
        <InfoCard
          color={colors.deepOrange[600]}
          bgcolor={colors.deepOrange[50]}
          title="My account ENS"
          icon={<MdDriveFileRenameOutline size="1.6em" />}
          fetchData={fetchAddress}
        />
        <InfoCard
          color={colors.amber[600]}
          bgcolor={colors.amber[50]}
          title="Balance in Eth"
          icon={<SiEthereum size="1.6em" />}
          fetchData={fetchBalance}
        />
        <InfoCard
          color={colors.green[600]}
          bgcolor={colors.green[50]}
          title="ETH price (on mainnet)"
          icon={<FaMoneyBill size="1.6em" />}
          fetchData={fetchUsdPrice}
        />
      </Stack>

      <Grid container spacing={2} sx={gridContainerSx}>
        <Grid item xs={4}>
          <TokenPanel
            defaultSelected={-1}
            onSelectedItem={(address: string, symbol: string) => {
              setSelectedToken({
                address,
                symbol,
              });
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <Box className="panel">
            <Typography variant="h6" sx={{ px: 2, pb: 2 }}>
              Recent Transactions (for the last 1000 blocks)
            </Typography>
            <TransferHistory {...selectedToken} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
