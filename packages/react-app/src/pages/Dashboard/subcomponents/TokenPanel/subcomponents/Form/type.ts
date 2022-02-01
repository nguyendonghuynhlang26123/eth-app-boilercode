export interface TokenDetails {
  address: string;
  symbol: string;
  decimal: number;
  image_url?: string;
}

export interface FormPropsType {
  show: boolean;
  title: string;
  data?: TokenDetails;
  handleSave: (data: TokenDetails) => any;
  handleBack: () => any;
}
