import { Box, Chip, colors, Grid, Stack, Typography } from '@mui/material';
import Utils from 'common/utils';
import { AppBreadcrumbs } from 'components';
import { ethers } from 'ethers';
import { useUsdPrice, useWeb3Provider } from 'hooks';
import React, { useCallback } from 'react';
import { FaMoneyBill } from 'react-icons/fa';
import { GiChaingun } from 'react-icons/gi';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { SiEthereum } from 'react-icons/si';
import { gridContainerSx } from './style';
import { InfoCard, TransferHistory } from './subcomponents';
import { TokenPanel } from './subcomponents/TokenPanel';
import { TransactionHistory } from './subcomponents/TransactionPanel';

function truncate(str: string, maxDecimalDigits: number) {
  if (str.includes('.')) {
    const parts = str.split('.');
    return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}
const prettyNum = (b: ethers.BigNumberish) => truncate(ethers.utils.formatEther(b), 2);

const Dashboard = () => {
  const { provider, account, ens } = useWeb3Provider();
  const [usd] = useUsdPrice();
  const [selectedToken, setSelectedToken] = React.useState<string>();

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
  }, [provider, account]);

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

      {provider ? (
        <Grid container spacing={2} sx={gridContainerSx}>
          <Grid item xs={12} className="no-pad-left">
            <Box className="panel">
              <Typography variant="h6" sx={{ pb: 2 }}>
                Recent Transactions (for the last 1000 blocks)
              </Typography>
              <TransactionHistory />
            </Box>
          </Grid>
          <Grid item xs={4} className="no-pad-left">
            <TokenPanel
              selectedAddress={selectedToken}
              onSelectedItem={(address?: string) => {
                setSelectedToken(address);
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <Box className="panel">
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{ px: 2, py: 1.5 }}>
                  Recent Token Transfered (for the last 1000 blocks)
                </Typography>
                {selectedToken && <Chip label={Utils.trimHash(selectedToken)} onDelete={() => setSelectedToken(undefined)} />}
              </Stack>
              <TransferHistory address={selectedToken} />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Typography sx={{ py: 2 }}>Please connect wallet to proceed</Typography>
      )}
    </Box>
  );
};

export default Dashboard;
