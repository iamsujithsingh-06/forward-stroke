import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function connectDB() {
  let uri = process.env.MONGODB_URI;

  console.log("URI EXISTS:", !!process.env.MONGODB_URI);
  console.log("URI START:", process.env.MONGODB_URI?.substring(0, 30));
  
  if (!uri || uri.includes('<username>')) {
    console.log('MONGODB_URI not configured; starting in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    process.env.MONGODB_URI = uri;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
}
