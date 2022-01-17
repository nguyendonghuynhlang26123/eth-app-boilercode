import React from 'react';
import { Navbar, useLoading } from 'components';
import { Outlet } from 'react-router-dom';
import { useWeb3Provider } from 'hooks';

const MainLayout = () => {
  const [loading] = useLoading();
  const { ens, disconnect, account, showConnectModal } = useWeb3Provider();

  return (
    <Navbar loading={loading} handleConnect={showConnectModal} ens={ens ?? ''} handleDisconnect={disconnect} account={account ?? ''}>
      <Outlet />
    </Navbar>
  );
};

export default MainLayout;
