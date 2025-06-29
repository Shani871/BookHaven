import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Book } from '../types';
import { useCart } from '../context/CartContext';

interface BookCardProps {
  book: Book;
  className?: string;
}

export default function BookCard({ book, className = '' }: BookCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(book);
  };

  return (
    <div className={`group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700 ${className}`}>
      {book.discount && (
        <div className="absolute top-3 left-3 z-10 bg-emerald-600 text-white px-2 py-1 rounded-lg text-sm font-semibold">
          -{book.discount}%
        </div>
      )}
      
      <Link to={`/books/${book.id}`} className="block">
        <div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-t-2xl">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
              {book.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{book.author}</p>
          </div>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.floor(book.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                {book.rating} ({book.reviewCount})
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ${book.price}
              </span>
              {book.originalPrice && (
                <span className="text-sm text-slate-500 line-through">
                  ${book.originalPrice}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl transition-colors duration-200 text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}