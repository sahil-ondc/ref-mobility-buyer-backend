import * as dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import Api from '../api/Api';
import MessageRespository from '../repo/MessageRespository';
import ContextBuilder from '../utilities/ContextBuilder';
import LoggingService from './LoggingService';

dotenv.config();

const subscribe = async (message) => {
  const logger = LoggingService.getLogger('SubscribeService');
  logger.debug(`Subscribe called with ${JSON.stringify(message)}`);
  const context = ContextBuilder.getSubscriberContext();

  const url = `${process.env.GATEWAY_URL}/subscribe`;
  const subscribeRequest = {
    context: {
      operation: {
        ops_no: 1,
      },
    },
    message: {
      entity: {
        gst: {
          legal_entity_name: process.env.GST_LEGAL_ENTITY_NAME,
          business_address: process.env.GST_BUSINESS_ADDRESS,
          city_code: [
            process.env.ENTITY_GST_CITY_CODE,
          ],
          gst_no: process.env.GST_NO,
        },
        pan: {
          name_as_per_pan: process.env.NAME_AS_PER_PAN,
          pan_no: process.env.PAN_NO,
          date_of_incorporation: process.env.PAN_DATE_OF_INCORPORATION,
        },
        name_of_authorised_signatory: process.env.NAME_OF_AUTHORISED_SIGNATORY,
        address_of_authorised_signatory: process.env.ADDRESS_OF_AUTHORISED_SIGNATORY,
        email_id: process.env.EMAIL_ID,
        mobile_no: process.env.MOBILE_NO,
        country: process.env.COUNTRY,
        subscriber_id: process.env.SUBSCRIBER_ID,
        unique_key_id: uuid(),
        callback_url: '/test',
        key_pair: {
          signing_public_key: process.env.PUBLIC_KEY,
          encryption_public_key: 'MCowBQYDK2VuAyEA5g6jAUxOn9E3MMkHYNLeNLHsVvPyCwLTtvkRYkOyOmE=',
          valid_from: process.env.VALID_FROM,
          valid_until: process.env.VALID_UNTIL,
        },
      },
      network_participant: [
        {
          subscriber_url: process.env.BUYER_APP_URL,
          domain: process.env.NETWORK_PARTICIPANT_DOMAIN,
          type: process.env.NETWORK_PARTICIPANT_TYPE,
          msn: false,
          city_code: [
            process.env.NETWORK_PARTICIPANT_CITY_CODE,
          ],
        },
      ],
      timestamp: moment().format(),
      request_id: process.env.REQUEST_ID,
    },
  };

  logger.debug(JSON.stringify(subscribeRequest));
  const response = await Api.doPost(url, JSON.stringify(subscribeRequest));
  const responseText = await response.text();
  logger.debug(`Response ${responseText}`);

  return context;
};

const storeSubscribeResult = (response) => {
  MessageRespository.storeResultWithRequestId(response);
};

const getSubscribeResult = (requestId) => MessageRespository.getResult(requestId);

export default {
  subscribe,
  getSubscribeResult,
  storeSubscribeResult,
};
