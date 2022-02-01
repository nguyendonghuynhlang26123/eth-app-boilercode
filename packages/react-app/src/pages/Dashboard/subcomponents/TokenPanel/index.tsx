import { Add, DeleteOutline, EditOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Dialog,
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
import { interfaceId } from 'common/constants/interfaceId';
import Utils from 'common/utils';
import { BigNumber, ethers } from 'ethers';
import { useDialog, useLocalStorage, useWeb3Provider } from 'hooks';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TokenForm } from './subcomponents';
import { TokenDetails } from './subcomponents/AddForm/type';
import { StoredToken, TokenItemPropsType, TokenPanelPropsType } from './type';

const abi = [
  // Get the account balance
  'function balanceOf(address) view returns (uint)',

  // Check ERC20 / ERC721
  'function supportsInterface(bytes4 interfaceId) view returns (bool) ',
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
  }, []);

  const getTokenType = async () => {
    // Note that this function only detected Openzeppelin version of ERC20 and ERC721 (implementing ERC165 is a must!);
    for (const { type, id } of interfaceId) {
      try {
        const result = await Utils.nullIfError(contract.supportsInterface(id), 'Check Token Type');
        if (result) return type;
      } catch (err) {}
    }
    return '';
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton selected={selected} onClick={handleOnClick}>
          <ListItemIcon>
            <Avatar src={token.image ?? Coin} sx={{ width: 32, height: 32 }} />
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

export const TokenPanel = ({ defaultSelected, onSelectedItem }: TokenPanelPropsType) => {
  const [savedTokens, setTokenList] = useLocalStorage<StoredToken[]>('tokens', []);
  const { account, provider } = useWeb3Provider();
  const [selected, setSelected] = useState<number>(defaultSelected);
  const [addForm, showAddForm] = useState<boolean>(false);
  const [editForm, showEditForm] = useState<boolean>(false);
  const [showDialog, DeleteDialog] = useDialog();
  const tokenList = React.useMemo(() => {
    if (savedTokens && provider && provider.network)
      return savedTokens.filter((t: StoredToken) => t.network === provider.network.chainId.toString());
  }, [savedTokens, provider]);

  useEffect(() => {
    if (selected !== defaultSelected && selected !== -1) {
      const selectedToken: StoredToken = tokenList[selected];
      onSelectedItem(selectedToken.contractAddress, selectedToken.symbol);
    }
  }, [selected]);

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
    setSelected(defaultSelected);
  };

  const handleEditToken = (data: TokenDetails, index: number) => {
    const newTokenList = [...tokenList];
    newTokenList[index] = {
      ...newTokenList[index],
      contractAddress: data.address,
      symbol: data.symbol,
      tokenDecimal: data.decimal,
      image: data.image_url,
    };
    setTokenList(newTokenList);
  };

  const handleDeleteToken = (index: number) => {
    const newList = [...tokenList];
    newList.splice(index, 1);
    setTokenList(newList);
    resetSelection();
  };

  const getSelectedToken = (i: number): TokenDetails | undefined => {
    const token: StoredToken = tokenList[i];
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
        <Typography variant="h6">Tokens</Typography>
        <Stack spacing={1}>
          <IconButton color="secondary" disabled={selected === -1} sx={{ borderRadius: 2 }} onClick={() => showEditForm(true)}>
            <EditOutlined />
          </IconButton>
          <IconButton
            color="error"
            disabled={selected === -1}
            sx={{ borderRadius: 2 }}
            onClick={() =>
              showDialog(`Do you want to delete ${tokenList[selected].symbol} token?`, () => {
                handleDeleteToken(selected);
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
              selected={selected === i}
              handleOnClick={() => setSelected(i)}
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
          data={getSelectedToken(selected)}
          show={editForm}
          handleSave={(data) => handleEditToken(data, selected)}
          handleBack={() => showEditForm(false)}
          title="Edit token"
        />
      )}

      <DeleteDialog />
    </Box>
  );
};
