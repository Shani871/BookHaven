import { Book } from '../types';

export const books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 12.99,
    originalPrice: 16.99,
    category: 'Fiction',
    image: 'https://th.bing.com/th/id/OIP.fFaX7nKq5_5gf2nSI3QEUgHaLK?w=199&h=300&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3',
    rating: 4.5,
    reviewCount: 2847,
    description: 'A classic American novel about the Jazz Age and the American Dream.',
    featured: true,
    discount: 24
  },
  {
    id: '2',
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    price: 14.99,
    category: 'Mystery',
    image: 'https://th.bing.com/th/id/OIP.XvJqvESbI0BtPkb1zp3mywHaLg?w=199&h=309&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3',
    rating: 4.7,
    reviewCount: 1923,
    description: 'A masterpiece of detective fiction featuring Hercule Poirot.',
    featured: true
  },
  {
    id: '3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    price: 18.99,
    originalPrice: 22.99,
    category: 'History',
    image: 'https://th.bing.com/th/id/OIP.Wdw8knp_mCAsj_Y4hZ4MQwHaLX?w=123&h=189&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3',
    rating: 4.6,
    reviewCount: 5234,
    description: 'An exploration of how Homo sapiens conquered the world.',
    featured: true,
    discount: 17
  },
  {
    id: '4',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 16.99,
    category: 'Self-Help',
    image: 'https://victoronsite.com/wp-content/uploads/2021/08/AtomicHabits_1book_2.png',
    rating: 4.8,
    reviewCount: 8934,
    description: 'Transform your life with the power of small daily improvements.',
    featured: true
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    price: 13.99,
    category: 'Fantasy',
    image: 'https://th.bing.com/th/id/OIP.u1jvgQh_S5zIR3e4uX5oNwHaLH?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3',
    rating: 4.9,
    reviewCount: 12456,
    description: 'The enchanting prelude to The Lord of the Rings.',
    featured: false
  },
  {
    id: '6',
    title: 'Educated',
    author: 'Tara Westover',
    price: 15.99,
    category: 'Biography',
    image: 'https://www.bookishelf.com/wp-content/uploads/2020/09/Book-Review-Educated-by-Tara-Westover.jpg',
    rating: 4.4,
    reviewCount: 6782,
    description: 'A powerful memoir about education and family.',
    featured: false
  },
  {
    id: '7',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    price: 14.49,
    category: 'Mystery',
    image: 'https://m.media-amazon.com/images/I/91BbLCJOruL.jpg',
    rating: 4.3,
    reviewCount: 4521,
    description: 'A psychological thriller that will keep you guessing.',
    featured: false
  },
  {
    id: '8',
    title: 'Dune',
    author: 'Frank Herbert',
    price: 17.99,
    category: 'Science Fiction',
    image: 'https://th.bing.com/th/id/OIP.kc59hFr2EgPG2qSem_ZnQQHaK-?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3',
    rating: 4.6,
    reviewCount: 9876,
    description: 'Epic science fiction masterpiece set on the desert planet Arrakis.',
    featured: false
  }
];

export const categories = [
  'All',
  'Fiction',
  'Mystery',
  'History',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'Self-Help'
];