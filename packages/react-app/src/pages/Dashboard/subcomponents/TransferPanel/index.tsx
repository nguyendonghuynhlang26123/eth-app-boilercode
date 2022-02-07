import { Link, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import Utils from 'common/utils';
import { ethers } from 'ethers';
import { useEthScanProvider, useWeb3Provider } from 'hooks';
import React from 'react';

interface TxHistory {
  id: string;
  hash: string;
  block: number;
  time: number;
  from: string;
  to: string | undefined;
  value: string;
  token: string;
  contract: string;
}

export const TransferHistory = ({ address }: { address?: string }) => {
  const { provider, account } = useWeb3Provider();
  const [ethScan, error] = useEthScanProvider(provider, ['kovan', 'ropsten', 'rinkeby']);
  const [data, setData] = React.useState<TxHistory[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [filtering, setFiltering] = React.useState<GridFilterModel>();

  React.useEffect(() => {
    setLoading(true);
    setData([]);
    if (account && ethScan) {
      const fetchingParams = {
        action: 'tokentx',
        address: account,
        startblock: -1000,
        endblock: 99999999,
        sort: 'asc',
      };
      Utils.nullIfError(ethScan.fetch('account', fetchingParams)).then(async (response: any) => {
        const data: TxHistory[] = [];
        for (let t of response) {
          data.push({
            id: t.hash,
            hash: t.hash.toString(),
            block: Number(t.blockNumber),
            time: Number(t.timeStamp) * 1000,
            from: t.from.toString(),
            to: t.to,
            value: ethers.utils.formatUnits(t.value, Number(t.tokenDecimal)),
            token: `${t.tokenSymbol} (${t.tokenName})`,
            contract: t.contractAddress,
          });
        }
        setData(data);
        setLoading(false);
      });
    }
  }, [account, ethScan]);

  React.useEffect(() => {
    if (address)
      setFiltering({
        items: [{ columnField: 'contract', operatorValue: 'contains', value: address }],
      });
    else setFiltering({ items: [] });
  }, [address]);

  const HashLink = React.useCallback(
    (hash: string | undefined, type: 'address' | 'tx') => {
      if (hash && ethScan) {
        const baseUrl = ethScan?.getBaseUrl().replace('api-', '');
        const isYou = type === 'address' && hash === account;
        return (
          <Tooltip title={hash} arrow>
            <Link href={`${baseUrl}/${type}/${hash}`} rel="noreferrer noopener" target="_blank">
              {isYou ? 'You' : Utils.trimHash(hash)}
            </Link>
          </Tooltip>
        );
      }
      return '-';
    },
    [ethScan, account],
  );

  const columns: GridColDef[] = [
    {
      field: 'hash',
      headerName: 'Tx Hash',
      minWidth: 120,
      renderCell: (params) => HashLink(params.value as string, 'tx'),
    },
    { field: 'block', headerName: 'Block', sortable: true, minWidth: 100 },
    {
      field: 'time',
      headerName: 'Age',
      minWidth: 140,
      valueFormatter: (params) => Utils.timeAgo(params.value as number),
    },
    {
      field: 'from',
      headerName: 'From',
      sortable: true,
      minWidth: 120,
      renderCell: (params) => HashLink(params.value as string, 'address'),
    },
    {
      field: 'to',
      headerName: 'To',
      sortable: true,
      minWidth: 120,
      renderCell: (params) => HashLink(params.value as string, 'address'),
    },
    {
      field: 'contract',
      headerName: 'Contract',
      minWidth: 120,
      renderCell: (params) => HashLink(params.value as string, 'address'),
    },
    {
      field: 'value',
      headerName: 'Value',
      minWidth: 60,
    },
    {
      field: 'token',
      headerName: 'Token',
      minWidth: 200,
    },
  ];

  return (
    <>
      {error ? (
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            loading={loading}
            disableSelectionOnClick
            filterModel={filtering}
            initialState={{
              sorting: {
                sortModel: [{ field: 'block', sort: 'desc' }],
              },
            }}
          />
        </div>
      )}
    </>
  );
};
