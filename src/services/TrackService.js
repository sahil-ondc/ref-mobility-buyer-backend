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
const track = async (trackRequest) => {
  const logger = LoggingService.getLogger('TrackService');
  const context = ContextBuilder.getContextWithContext('track', trackRequest.context);
  const { message } = trackRequest;
  const trackPayload = {
    context,
    message: {
      order_id: message?.order?.id,
    },
  };
  const url = `${replaceEndingSlash(trackRequest.context.bpp_uri)}/track`;
  logger.debug(`Track Pay Load ${trackPayload}`);

  const trackResponse = await Api.doPost(url, JSON.stringify(trackPayload));
  const responseText = await trackResponse.text();
  logger.debug(`Response ${responseText}`);
  return context;
};

const storeTrackResult = (response) => {
  MessageRespository.storeResult(response);
};

const getTrackResult = (messageId) => MessageRespository.getResult(messageId);

export default {
  track,
  storeTrackResult,
  getTrackResult,
};
