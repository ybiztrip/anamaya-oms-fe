export type ActivityLogType = 'TRAVEL_POLICY';

export type ActivityLogDetailType = {
  id: number;
  companyId: number;
  type: ActivityLogType;
  referenceId: number;
  status: number;
  createdBy?: number;
  createdAt?: string;
  updatedBy?: number;
  updatedAt?: string;
};

export type ActivityLogListPayloadType = {
  page: number;
  size: number;
  type: ActivityLogType;
  referenceId: number;
};
