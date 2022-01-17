import React from 'react';
import { ethers } from 'ethers';
import { Stack, Typography, Box } from '@mui/material';
import { colors } from '@mui/material';
import { InfoCard } from './subcomponents';
import { SiEthereum } from 'react-icons/si';
import { FaMoneyBill } from 'react-icons/fa';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { GiChaingun } from 'react-icons/gi';
import { AppBreadcrumbs } from 'components';
import { useWeb3Provider } from 'hooks';

const prettyNum = (b: ethers.BigNumberish) => ethers.utils.commify(ethers.utils.formatEther(b));

const Dashboard = () => {
  const { provider, account, ens, signer } = useWeb3Provider();
  /**
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
   */
  const fetchChainId = async () => {
    if (provider) {
      const result = await provider.getNetwork();
      return `${result.name} (${result.chainId})`;
    } else return '-';
  };

  const fetchAddress = async () => {
    return ens || '-';
  };

  const fetchBalance = async () => {
    if (provider && account) {
      let result = await provider.getBalance(account);
      return prettyNum(result) + ' ETH';
    } else return '-';
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
          title=""
          icon={<FaMoneyBill size="1.6em" />}
          fetchData={fetchChainId}
        />
      </Stack>
    </Box>
  );
};

export default Dashboard;
