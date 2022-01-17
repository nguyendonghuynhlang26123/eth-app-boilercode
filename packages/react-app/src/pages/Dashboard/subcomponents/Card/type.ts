export type InfoCardProps = {
  color: string;
  bgcolor: string;
  title: string;
  icon: JSX.Element;
  fetchData: () => Promise<string>;
};
