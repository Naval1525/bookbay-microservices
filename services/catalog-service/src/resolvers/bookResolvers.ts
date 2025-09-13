import {
    getAllBooks,
    getBookById,
    searchBooks,
    getBooksByCategory
  } from '../services/bookService';
  import { Book } from '../models/Book';

  export const resolvers = {
    Query: {
      books: async () => {
        try {
          return await getAllBooks();
        } catch (error) {
          console.log('❌ Error in books resolver:', error);
          throw new Error('Failed to fetch books');
        }
      },

      book: async (_: any, { id }: { id: string }) => {
        try {
          const book = await getBookById(id);
          if (!book) {
            throw new Error('Book not found');
          }
          return book;
        } catch (error) {
          console.log('❌ Error in book resolver:', error);
          throw new Error('Failed to fetch book');
        }
      },

      searchBooks: async (_: any, { query }: { query: string }) => {
        try {
          if (!query || query.trim().length === 0) {
            return [];
          }
          return await searchBooks(query);
        } catch (error) {
          console.log('❌ Error in searchBooks resolver:', error);
          throw new Error('Failed to search books');
        }
      },

      booksByCategory: async (_: any, { category }: { category: string }) => {
        try {
          return await getBooksByCategory(category);
        } catch (error) {
          console.log('❌ Error in booksByCategory resolver:', error);
          throw new Error('Failed to fetch books by category');
        }
      },

      categories: async () => {
        try {
          const categories = await Book.distinct('category');
          return categories.sort();
        } catch (error) {
          console.log('❌ Error in categories resolver:', error);
          throw new Error('Failed to fetch categories');
        }
      }
    },

    Mutation: {
      addBook: async (_: any, { input }: { input: any }) => {
        try {
          const book = new Book(input);
          await book.save();
          console.log('✅ New book added:', book.title);
          return book;
        } catch (error) {
          console.log('❌ Error adding book:', error);
          throw new Error('Failed to add book');
        }
      },

      updateBook: async (_: any, { id, input }: { id: string; input: any }) => {
        try {
          const book = await Book.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true
          });
          if (!book) {
            throw new Error('Book not found');
          }
          console.log('✅ Book updated:', book.title);
          return book;
        } catch (error) {
          console.log('❌ Error updating book:', error);
          throw new Error('Failed to update book');
        }
      },

      deleteBook: async (_: any, { id }: { id: string }) => {
        try {
          const book = await Book.findByIdAndDelete(id);
          if (!book) {
            throw new Error('Book not found');
          }
          console.log('✅ Book deleted:', book.title);
          return true;
        } catch (error) {
          console.log('❌ Error deleting book:', error);
          throw new Error('Failed to delete book');
        }
      }
    }
  };