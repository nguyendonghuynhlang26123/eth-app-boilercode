import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import Coin from 'assets/images/coin.svg';
import Utils from 'common/utils';
import { BigNumber, ethers } from 'ethers';
import { useDialog, useLocalStorage, useWeb3Provider } from 'hooks';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TokenForm } from './subcomponents';
import { TokenDetails } from './subcomponents/Form/type';
import { StoredToken, TokenItemPropsType, TokenPanelPropsType } from './type';

const abi = [
  // Get the account balance
  'function balanceOf(address) view returns (uint)',
];

const TokenItem = ({ token, account, provider, selected, handleOnClick }: TokenItemPropsType) => {
  const [balance, setBalance] = useState<string>('0');
  const [error, setError] = useState<string>('');
  const contract = new ethers.Contract(token.contractAddress, abi, provider);

  useEffect(() => {
    Utils.nullIfError(contract.balanceOf(account))
      .then((result: BigNumber | null) => (result ? setBalance(ethers.utils.formatUnits(result, token.tokenDecimal)) : '0'))
      .catch(() => {
        setError('Cannot find token balance');
      });
  }, [account, contract]);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton selected={selected} onClick={handleOnClick}>
          <ListItemIcon>
            <Avatar src={token.image} sx={{ width: 32, height: 32 }}>
              <img src={Coin} alt="Coin" />
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={`${balance} ${token.symbol}`}
            secondary={error && <Typography color="error">{'⛔ ' + error}</Typography>}
          />
        </ListItemButton>
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export const TokenPanel = ({ selectedAddress, onSelectedItem }: TokenPanelPropsType) => {
  const [savedTokens, setTokenList] = useLocalStorage<StoredToken[]>('tokens', []);
  const { account, provider } = useWeb3Provider();
  const [addForm, showAddForm] = useState<boolean>(false);
  const [editForm, showEditForm] = useState<boolean>(false);
  const [showDialog, DeleteDialog] = useDialog();
  const tokenList = React.useMemo(() => {
    if (savedTokens && provider && provider.network)
      return savedTokens.filter((t: StoredToken) => t.network.toString() === provider.network.chainId.toString());
  }, [savedTokens, provider]);

  const handleSaveToken = (data: TokenDetails) => {
    if (provider) {
      if (tokenList.find((t: StoredToken) => t.contractAddress === data.address)) {
        toast.warn('Token existed');
      } else
        Utils.nullIfError(provider.getNetwork()).then((network: any) => {
          if (network)
            setTokenList([
              ...tokenList,
              {
                network: network.chainId,
                contractAddress: data.address,
                symbol: data.symbol,
                tokenDecimal: data.decimal,
                image: data.image_url,
              },
            ]);
        });
    }
  };

  const resetSelection = () => {
    onSelectedItem(undefined);
  };

  const handleEditToken = (data: TokenDetails, address: string) => {
    const newTokenList = savedTokens.map((t: StoredToken) => {
      if (t.contractAddress === address)
        return {
          ...t,
          contractAddress: data.address,
          symbol: data.symbol,
          tokenDecimal: data.decimal,
          image: data.image_url,
        };
      return t;
    });
    setTokenList(newTokenList);
  };

  const handleDeleteToken = (deleteAddress: string) => {
    if (deleteAddress) {
      const newList = savedTokens.filter((t: StoredToken) => t.contractAddress !== deleteAddress);
      setTokenList(newList);
      resetSelection();
    }
  };

  const getSelectedToken = (address: string): TokenDetails | undefined => {
    if (!address) return undefined;
    const token: StoredToken = tokenList.find((t: StoredToken) => t.contractAddress === address);
    if (!token) return undefined;
    return {
      address: token.contractAddress,
      symbol: token.symbol,
      decimal: token.tokenDecimal,
      image_url: token.image,
    };
  };

  return (
    <Box className="panel">
      <Stack justifyContent="space-between">
        <Typography variant="h6">ERC20 Tokens</Typography>
        <Stack spacing={1}>
          <IconButton color="secondary" disabled={!selectedAddress} sx={{ borderRadius: 2 }} onClick={() => showEditForm(true)}>
            <EditOutlined />
          </IconButton>
          <IconButton
            color="error"
            disabled={!selectedAddress}
            sx={{ borderRadius: 2 }}
            onClick={() =>
              showDialog(`Do you want to delete this token?`, () => {
                handleDeleteToken(selectedAddress as string);
              })
            }
          >
            <DeleteOutline />
          </IconButton>
          <IconButton color="primary" sx={{ borderRadius: 2 }} onClick={() => showAddForm(true)}>
            <Add />
          </IconButton>
        </Stack>
      </Stack>

      <List sx={{ width: '100%', bgcolor: 'background.paper', '& .MuiListItemButton-root': { height: 60 } }} aria-label="contacts">
        {tokenList &&
          account &&
          provider &&
          tokenList.map((token: StoredToken, i: number) => (
            <TokenItem
              token={token}
              account={account}
              provider={provider}
              key={i}
              selected={selectedAddress === token.contractAddress}
              handleOnClick={() => onSelectedItem(token.contractAddress)}
            />
          ))}
        {tokenList && tokenList.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No token registered for this network
          </Typography>
        )}
      </List>

      {/* Add Form */}
      <TokenForm show={addForm} handleSave={handleSaveToken} handleBack={() => showAddForm(false)} title="Add a token" />

      {editForm && (
        <TokenForm
          data={getSelectedToken(selectedAddress as string)}
          show={editForm}
          handleSave={(data) => handleEditToken(data, selectedAddress as string)}
          handleBack={() => showEditForm(false)}
          title="Edit token"
        />
      )}

      <DeleteDialog />
    </Box>
  );
};
