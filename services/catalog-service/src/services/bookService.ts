import { Book, IBook } from "../models/Book";
import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

export const initializeRedis = async (): Promise<void> => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => {
      console.log("❌ Redis Client Error:", err);
    });

    await redisClient.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.log("❌ Redis connection failed:", error);
  }
};
const CACHE_TTL = 300;

export const getAllBooks = async (): Promise<IBook[]> => {
  try {
    console.log("🔄 Fetching all books...");

    // Try to get from cache first
    const cacheKey = "books:all";
    if (redisClient) {
      try {
        const cachedBooks = await redisClient.get(cacheKey);
        if (cachedBooks) {
          console.log("📦 Books retrieved from cache");
          return JSON.parse(cachedBooks);
        }
      } catch (cacheError) {
        console.log("❌ Cache error:", cacheError);
      }
    }

    // Fetch from database
    const books = await Book.find().sort({ createdAt: -1 });
    console.log(`✅ Retrieved ${books.length} books from database`);

    // Cache the result
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(books));
        console.log("📦 Books cached successfully");
      } catch (cacheError) {
        console.log("❌ Cache set error:", cacheError);
      }
    }

    return books;
  } catch (error) {
    console.log("❌ Error fetching books:", error);
    throw error;
  }
};

export const getBookById = async (id: string): Promise<IBook | null> => {
  try {
    console.log("🔄 Fetching book by ID:", id);

    // Try cache first
    const cacheKey = `book:${id}`;
    if (redisClient) {
      try {
        const cachedBook = await redisClient.get(cacheKey);
        if (cachedBook) {
          console.log("📦 Book retrieved from cache");
          return JSON.parse(cachedBook);
        }
      } catch (cacheError) {
        console.log("❌ Cache error:", cacheError);
      }
    }

    // Fetch from database
    const book = await Book.findById(id);
    if (!book) {
      return null;
    }

    console.log("✅ Book retrieved from database");

    // Cache the result
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(book));
        console.log("📦 Book cached successfully");
      } catch (cacheError) {
        console.log("❌ Cache set error:", cacheError);
      }
    }

    return book;
  } catch (error) {
    console.log("❌ Error fetching book by ID:", error);
    throw error;
  }
};

export const searchBooks = async (query: string): Promise<IBook[]> => {
  try {
    console.log("🔍 Searching books with query:", query);

    // Try cache first
    const cacheKey = `search:${query.toLowerCase()}`;
    if (redisClient) {
      try {
        const cachedResults = await redisClient.get(cacheKey);
        if (cachedResults) {
          console.log("📦 Search results retrieved from cache");
          return JSON.parse(cachedResults);
        }
      } catch (cacheError) {
        console.log("❌ Cache error:", cacheError);
      }
    }

    // Search in database using text index
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    }).limit(50);

    console.log(`✅ Found ${books.length} books matching query`);

    // Cache the results
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(books));
        console.log("📦 Search results cached successfully");
      } catch (cacheError) {
        console.log("❌ Cache set error:", cacheError);
      }
    }

    return books;
  } catch (error) {
    console.log("❌ Error searching books:", error);
    throw error;
  }
};

export const getBooksByCategory = async (
  category: string
): Promise<IBook[]> => {
  try {
    console.log("🔄 Fetching books by category:", category);

    // Try cache first
    const cacheKey = `category:${category.toLowerCase()}`;
    if (redisClient) {
      try {
        const cachedBooks = await redisClient.get(cacheKey);
        if (cachedBooks) {
          console.log("📦 Category books retrieved from cache");
          return JSON.parse(cachedBooks);
        }
      } catch (cacheError) {
        console.log("❌ Cache error:", cacheError);
      }
    }

    // Fetch from database
    const books = await Book.find({
      category: { $regex: category, $options: "i" },
    }).sort({ createdAt: -1 });

    console.log(`✅ Found ${books.length} books in category`);

    // Cache the results
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(books));
        console.log("📦 Category books cached successfully");
      } catch (cacheError) {
        console.log("❌ Cache set error:", cacheError);
      }
    }

    return books;
  } catch (error) {
    console.log("❌ Error fetching books by category:", error);
    throw error;
  }
};

// Helper function to seed some sample books
export const seedBooks = async (): Promise<void> => {
  try {
    const existingBooks = await Book.countDocuments();
    if (existingBooks > 0) {
      console.log("📚 Books already exist, skipping seed");
      return;
    }

    console.log("🌱 Seeding sample books...");

    const sampleBooks = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 12.99,
        description: "A classic American novel set in the Jazz Age",
        stock: 50,
        isbn: "978-0-7432-7356-5",
        category: "Fiction",
        publishedDate: new Date("1925-04-10"),
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 14.99,
        description:
          "A gripping tale of racial injustice and childhood innocence",
        stock: 30,
        isbn: "978-0-06-112008-4",
        category: "Fiction",
        publishedDate: new Date("1960-07-11"),
      },
      {
        title: "1984",
        author: "George Orwell",
        price: 13.99,
        description: "A dystopian social science fiction novel",
        stock: 40,
        isbn: "978-0-452-28423-4",
        category: "Science Fiction",
        publishedDate: new Date("1949-06-08"),
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 11.99,
        description: "A romantic novel of manners",
        stock: 25,
        isbn: "978-0-14-143951-8",
        category: "Romance",
        publishedDate: new Date("1813-01-28"),
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        price: 13.5,
        description: "A controversial novel about teenage rebellion",
        stock: 35,
        isbn: "978-0-316-76948-0",
        category: "Fiction",
        publishedDate: new Date("1951-07-16"),
      },
    ];

    await Book.insertMany(sampleBooks);
    console.log(`✅ Successfully seeded ${sampleBooks.length} books`);
  } catch (error) {
    console.log("❌ Error seeding books:", error);
  }
};
