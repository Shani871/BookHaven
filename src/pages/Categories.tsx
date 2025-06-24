import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { books, categories } from '../data/books';
import BookCard from '../components/BookCard';

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const getCategoryBooks = (category: string) => {
    if (category === 'All') return books;
    return books.filter(book => book.category === category);
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All') return books.length;
    return books.filter(book => book.category === category).length;
  };

  const displayedBooks = getCategoryBooks(selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Book Categories
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our diverse collection organized by genre. Find exactly what you're looking for.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-red-600 text-white shadow-lg transform scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 shadow-md hover:shadow-lg'
              }`}
            >
              {category}
              <span className="ml-2 text-sm opacity-75">
                ({getCategoryCount(category)})
              </span>
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {selectedCategory === 'All' ? 'All Books' : selectedCategory}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {displayedBooks.length} books available
          </p>
        </div>

        {/* Books Grid */}
        {displayedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <BookOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No books in this category
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Check back later for new additions to this category
            </p>
          </div>
        )}

        {/* Category Stats */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Collection Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => (
              <div key={category} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {getCategoryCount(category)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}