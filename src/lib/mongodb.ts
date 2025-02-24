import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global as any;

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.mongoose.conn) {
    console.log('Using cached MongoDB connection');
    return cached.mongoose.conn;
  }

  if (!cached.mongoose.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('Connecting to MongoDB...');
    cached.mongoose.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    }).catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      cached.mongoose.promise = null;
      throw error;
    });
  }

  try {
    cached.mongoose.conn = await cached.mongoose.promise;
    return cached.mongoose.conn;
  } catch (e) {
    cached.mongoose.promise = null;
    console.error('Failed to establish MongoDB connection:', e);
    throw e;
  }
}

// Handle connection errors
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
  cached.mongoose.conn = null;
  cached.mongoose.promise = null;
});

export default connectDB; 