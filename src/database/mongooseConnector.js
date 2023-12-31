import mongoose from 'mongoose';

const dbConnect = async () => {
  // Need to read this from a configuration file
  if (!process.env.MONGO_DB_URL) {
    throw new Error('Database connection string not configured in ENV file');
  }
  const dbUri = process.env.MONGO_DB_URL;

  return mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

export default dbConnect;
