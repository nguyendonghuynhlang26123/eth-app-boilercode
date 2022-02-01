export interface TokenDetails {
  address: string;
  symbol: string;
  decimal: number;
  image_url?: string;
}

export interface EditFormPropsType {
  show: boolean;
  data: TokenDetails;
  handleSave: (data: TokenDetails) => any;
  handleBack: () => any;
}
