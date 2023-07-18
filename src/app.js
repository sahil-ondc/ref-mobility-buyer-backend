import express from 'express';
import * as dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import AuthController from './controllers/AuthController';
import TripController from './controllers/TripController';
import ConfirmController from './controllers/ConfirmController';
import OnConfirmController from './controllers/OnConfirmController';
import OnSearchController from './controllers/OnSearchController';
import OnSelectController from './controllers/OnSelectController';
import SearchController from './controllers/SearchController';
import SelectController from './controllers/SelectController';
import LoggingService from './services/LoggingService';
import InitController from './controllers/InitController';
import OnInitController from './controllers/OnInitController';
import StatusController from './controllers/StatusController';
import OnStatusController from './controllers/OnStatusController';
import TrackController from './controllers/TrackController';
import OnTrackController from './controllers/OnTrackController';
import SubscribeController from './controllers/SubscribeController';
import OnSubscribeController from './controllers/OnSubscribeController';
import SignatureHelper from './utilities/SignVerify/SignatureHelper';
import dbConnect from './database/mongooseConnector';
import authenticate from './middleware/Authentication';

dotenv.config();
process.env.REQUEST_ID = uuid();
const app = express();
const logger = LoggingService.getLogger('App');
const port = process.env.BUYER_APP_PORT ? process.env.BUYER_APP_PORT : 2010;

const filename = fileURLToPath(import.meta.url);

const dirname = path.dirname(filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(dirname, 'views'));
app.use(express.static(path.join(dirname, 'public')));

app.get('/v1', (req, res) => {
  res.send(`Sample BAP is running ${new Date()}`);
});

app.post('/v1/login', AuthController.login);
app.post('/v1/sign-up', AuthController.signUp);
app.post('/v1/google-login', AuthController.googleLogin);

app.get('/v1/user-details', authenticate, AuthController.userDetails);
app.post('/v1/user-detail', authenticate, AuthController.updateUserDetail);
app.put('/v1/user-details', authenticate, AuthController.updateUserDetails);

app.post('/v1/create-trip', authenticate, TripController.createTrip);
app.get('/v1/all-trips', authenticate, TripController.getAllTrips);
app.get('/v1/trip/:tripId', authenticate, TripController.getsingleTrip);

app.post('/v1/search', SearchController.search);
app.get('/v1/search', SearchController.searchResult);
app.post('/v1/on_search', OnSearchController.onSearch);

app.post('/v1/select', SelectController.select);
app.post('/v1/on_select', OnSelectController.onSelect);
app.get('/v1/select', SelectController.selectResult);

app.post('/v1/confirm', ConfirmController.confirm);
app.post('/v1/on_confirm', OnConfirmController.onConfirm);
app.get('/v1/confirm', ConfirmController.confirmResult);

app.post('/v1/init', InitController.init);
app.post('/v1/on_init', OnInitController.onInit);
app.get('/v1/init', InitController.initResult);

app.post('/v1/status', StatusController.status);
app.post('/v1/on_status', OnStatusController.onStatus);
app.get('/v1/status', StatusController.statusResult);

app.post('/v1/track', TrackController.track);
app.post('/v1/on_track', OnTrackController.onTrack);
app.get('/v1/track', TrackController.trackResult);

app.post('/v1/subscribe', SubscribeController.subscribe);
app.post('/v1/on_subscribe', OnSubscribeController.onSubscribe);

const registerVerificationPage = async (application) => {
  application.get('/ondc-site-verification.html', async (req, res) => {
    const signedRequestId = await SignatureHelper.createSignedData(
      process.env.REQUEST_ID,
      process.env.PRIVATE_KEY,
    );
    res.status(200).render('ondc-site-verification', {
      SIGNED_UNIQUE_REQ_ID: signedRequestId,
    });
  });
};

// configure mongodb connection
if (process.env.MONGO_DB_URL) {
  dbConnect()
    .then(() => {
      logger.info('Database connection successful');

      app.listen(port, async () => {
        logger.info(`Sample BAP listening on port ${port}`);
        await registerVerificationPage(app);
      });
    })
    .catch((error) => {
      logger.error('Error connecting to the database', error);
      return error;
    });
}
