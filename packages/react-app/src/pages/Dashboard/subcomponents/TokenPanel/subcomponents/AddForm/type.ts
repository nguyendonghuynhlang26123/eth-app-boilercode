export interface TokenDetails {
  address: string;
  symbol: string;
  decimal: number;
  image_url?: string;
}

export interface AddFormPropsType {
  show: boolean;
  handleSave: (data: TokenDetails) => any;
  handleBack: () => any;
}
