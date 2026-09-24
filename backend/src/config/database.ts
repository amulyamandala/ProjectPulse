import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.DB_URL || process.env.MONGODB_URI || 'mongodb+srv://amulyamandala007_db_user:IXsyeYTR9m2eScY1@atp.tkvp1eu.mongodb.net/projectpulse?appName=Atp';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
