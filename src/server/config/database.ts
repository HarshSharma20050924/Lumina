import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // According to Architecture.md, we're using PostgreSQL, but the models use Mongoose (MongoDB)
    // For consistency with the existing models, we'll use MongoDB here
    // In a real application, we would implement PostgreSQL with Prisma or similar
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lumina-ecommerce');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;