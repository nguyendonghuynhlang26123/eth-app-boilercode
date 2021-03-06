import { Check, Error } from '@mui/icons-material';
import { Chip, Link, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Utils from 'common/utils';
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
  status: boolean;
  confirmations: number;
  type: string;
  creates: string;
}

const CONTRACT_CREATION = '📜 Contract Creation';

export const TransactionHistory = () => {
  const { provider, account } = useWeb3Provider();
  const [ethScan, error] = useEthScanProvider(provider, ['kovan', 'ropsten', 'rinkeby']);
  const [data, setData] = React.useState<TxHistory[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    setLoading(true);
    setData([]);
    if (account && ethScan)
      Utils.nullIfError(ethScan.getHistory(account, -1000)).then(async (response: any) => {
        const data: TxHistory[] = [];
        for (let t of response) {
          const functionSignature = t.data.slice(0, 8);
          const functionName =
            (t.data === '0x' ? 'Transfer' : t.creates ? CONTRACT_CREATION : await Utils.getFuncBySignature(functionSignature)) ??
            functionSignature;
          data.push({
            id: t.hash,
            hash: t.hash.toString(),
            block: Number(t.blockNumber),
            time: Number(t.timestamp) * 1000,
            from: t.from.toString(),
            to: t.to,
            value: Utils.prettyNum(t.value) + ' ETH',
            status: t.isError !== '0',
            type: functionName,
            confirmations: Number(t.confirmations),
            creates: t.creates,
          });
        }
        setData(data);
        setLoading(false);
      });
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

  const ContractCreationType = React.useCallback(
    (contract: string | undefined) => {
      if (contract && ethScan) {
        const baseUrl = ethScan?.getBaseUrl().replace('api-', '');
        return (
          <Tooltip title={'Contract ' + contract} arrow>
            <Chip
              label={CONTRACT_CREATION}
              size="small"
              component="a"
              clickable
              href={`${baseUrl}/address/${contract}`}
              rel="noreferrer noopener"
              target="_blank"
            />
          </Tooltip>
        );
      }
      return '-';
    },
    [ethScan],
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
      valueFormatter: (params) => Utils.timeAgo(Number(params.value)),
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 200,
      renderCell: (params) => {
        if (params.value === CONTRACT_CREATION) return ContractCreationType(params.row['creates']);
        return <Chip label={params.value} size="small" />;
      },
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
      field: 'value',
      headerName: 'Value',
      minWidth: 60,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Tooltip title={params.row['confirmations'] + ' confirmations'} arrow>
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
            loading={loading}
            disableSelectionOnClick
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
