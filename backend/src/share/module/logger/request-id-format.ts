// logger/request-id.format.ts
import { format } from 'winston';
import { ClsServiceManager } from 'nestjs-cls';

export const requestIdFormat = format((info) => {
  const cls = ClsServiceManager.getClsService();
  const requestId = cls?.get('requestId') || 'N/A';

  info.requestId = requestId;
  return info;
});
