import { Check, Error } from '@mui/icons-material';
import { Chip, Link, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Utils from 'common/utils';
import { useEthScanProvider, useWeb3Provider } from 'hooks';
import React from 'react';

const abi = ['event Transfer(address indexed from, address indexed to, uint amount)'];

interface TxHistory {
  id: string;
  hash: string;
  block: number;
  time: string;
  from: string;
  to: string | undefined;
  value: string;
  status: boolean;
  confirmations: number;
  type: 'Transfer' | '📜 Contract Creation' | 'Function execution';
}

export const TransferHistory = ({ address, symbol }: { address?: string; symbol?: string }) => {
  const { provider, account } = useWeb3Provider();
  const [ethScan, error] = useEthScanProvider(provider, ['kovan', 'ropsten', 'rinkeby']);
  const [data, setData] = React.useState<TxHistory[]>([]);
  console.log('Data ', data);

  React.useEffect(() => {
    if (account && ethScan)
      Utils.nullIfError(ethScan.getHistory(account, -1000)).then((response: any) =>
        setData(
          response.map(
            (t: any): TxHistory => ({
              id: t.hash,
              hash: t.hash.toString(),
              block: t.blockNumber,
              time: Utils.timeAgo(Number(t.timestamp) * 1000),
              from: t.from.toString(),
              to: t.to,
              value: Utils.prettyNum(t.value) + ' ETH',
              status: t.isError !== '0',
              type: t.data === '0x' ? 'Transfer' : t.creates ? '📜 Contract Creation' : 'Function execution',
              confirmations: Number(t.confirmations),
            }),
          ),
        ),
      );
  }, [account, ethScan]);

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
      minWidth: 150,
      renderCell: (params) => HashLink(params.value as string, 'tx'),
    },
    { field: 'block', headerName: 'Block', sortable: true, minWidth: 120 },
    {
      field: 'time',
      headerName: 'Age',
      minWidth: 150,
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 200,
      renderCell: (params) => <Chip label={params.value} />,
    },
    {
      field: 'from',
      headerName: 'From',
      sortable: true,
      minWidth: 150,
      renderCell: (params) => HashLink(params.value as string, 'address'),
    },
    {
      field: 'to',
      headerName: 'To',
      sortable: true,
      minWidth: 150,
      renderCell: (params) => HashLink(params.value as string, 'address'),
    },
    {
      field: 'value',
      headerName: 'Value',
      minWidth: 60,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.getValue(params.id, 'confirmations') + ' confirmations'} arrow>
          <Chip
            icon={params.value ? <Check /> : <Error />}
            label={params.value ? 'Success' : 'Failed'}
            color={params.value ? 'success' : 'error'}
            variant="outlined"
            size="small"
          />
        </Tooltip>
      ),
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
            loading={!data || data.length === 0}
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
