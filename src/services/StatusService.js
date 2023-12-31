import * as dotenv from 'dotenv';
import Api from '../api/Api';
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';
import MessageRespository from '../repo/MessageRespository';

dotenv.config();
function replaceEndingSlash(url) {
  if (url.endsWith('/')) {
    return url.slice(0, -1);
  }
  return url;
}
const status = async (statusRequest) => {
  const logger = LoggingService.getLogger('StatusService');
  const context = ContextBuilder.getContextWithContext(
    'status',
    statusRequest.context,
  );
  const { message } = statusRequest;
  const statusPayload = {
    context,
    message: {
      order_id: message?.order?.id,
    },
  };
  const url = `${replaceEndingSlash(statusRequest.context.bpp_uri)}/status`;
  logger.debug(`Status Pay Load ${statusPayload}`);

  const statusResponse = await Api.doPost(url, JSON.stringify(statusPayload));
  const responseText = await statusResponse.text();
  logger.debug(`Response ${responseText}`);
  return context;
};

const storeStatusResult = (response) => {
  MessageRespository.storeResult(response);
};

const getStatusResult = (messageId) => MessageRespository.getResult(messageId);

export default {
  status,
  storeStatusResult,
  getStatusResult,
};
