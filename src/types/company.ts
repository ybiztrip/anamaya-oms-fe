export type CompanyConfigType = {
  id: number;
  companyId: number;
  code: string;
  valueBool: boolean;
  status: number;
  isVisible: number;
  createdAt: string;
  updatedAt: string;
};

export type CompanyConfigsUpdatePayloadType = {
  items: {
    code: string;
    valueBool: boolean;
  }[];
};
