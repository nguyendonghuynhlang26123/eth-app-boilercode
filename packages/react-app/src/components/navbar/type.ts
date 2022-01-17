export type NavbarProps = {
  loading: boolean;
  children: React.ReactElement | React.ReactElement[];
  account: string;
  ens: string;
  handleDisconnect: VoidFunction;
  handleConnect: VoidFunction;
};
