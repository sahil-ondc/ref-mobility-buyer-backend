import LoggingService from '../services/LoggingService';
import SelectService from '../services/SelectService';
import genericResponse from '../utilities/GenericResponse';
// import authVerifier from '../utilities/SignVerify/AuthHeaderVerifier';
// import LookUpService from '../services/LookUpService';

const onSelect = async (req, res) => {
  const logger = LoggingService.getLogger('OnSelectController');
  logger.debug(`on_select called with ${JSON.stringify(req.body)}`);
  logger.debug(req.body.message.order.provider.id);
  // const publicKey = await LookUpService.getPublicKeyWithUkId(req.body.message.order.provider.id);
  try {
    // await authVerifier.authorize(req, publicKey);
    logger.debug('Request Authorized Successfully.');
    SelectService.storeSelectResult(req.body);
    genericResponse.sendAcknowledgement(res);
  } catch (error) {
    logger.error(`Authorization Failed ${error}`);
    genericResponse.sendErrorWithAuthorization(res);
  }
};

export default {
  onSelect,
};
