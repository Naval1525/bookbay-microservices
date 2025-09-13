import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './schema/bookSchema';
import { resolvers } from './resolvers/bookResolvers';
import { initializeRedis, seedBooks } from './services/bookService';

dotenv.config();

const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookbay';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'catalog-service',
    timestamp: new Date().toISOString()
  });
});

// Database connection
const connectDB = async (): Promise<void> => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    // Seed books after connection
    await seedBooks();
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Initialize Apollo Server
const startServer = async (): Promise<void> => {
  await connectDB();
  await initializeRedis();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return { req };
    }
  });

  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  app.listen(PORT, () => {
    console.log(`🚀 Catalog Service running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🎯 GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`🎪 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer().catch((error) => {
  console.log('❌ Failed to start server:', error);
});

export default app;