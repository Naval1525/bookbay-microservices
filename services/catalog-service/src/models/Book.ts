import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  price: number;
  description: string;
  stock: number;
  isbn: string;
  category: string;
  publishedDate: Date;
  createdAt: Date;
}

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  publishedDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

export const Book = mongoose.model<IBook>('Book', bookSchema);