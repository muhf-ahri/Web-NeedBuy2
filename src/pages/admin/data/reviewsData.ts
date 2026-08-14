// src/pages/admin/data/reviewsData.ts
export type ReviewStatus = 'Published' | 'Hidden' | 'Reported';
export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export interface Review {
  id: string;
  productName: string;
  productCategory: string;
  reviewerName: string;
  isVerified: boolean;
  rating: ReviewRating;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export const DUMMY_REVIEWS: Review[] = [
  {
    id: '1',
    productName: 'Aura Pro Wireless Headphones',
    productCategory: 'Electronics',
    reviewerName: 'Sarah J.',
    isVerified: true,
    rating: 5,
    comment: 'Absolutely love these! The sound quality is amazing and noise cancellation works perfectly.',
    status: 'Published',
    createdAt: '2024-10-24',
  },
  {
    id: '2',
    productName: 'Artisan Ceramic Mug Set',
    productCategory: 'Home & Kitchen',
    reviewerName: 'Michael T.',
    isVerified: false,
    rating: 3,
    comment: 'Arrived broken. The packaging was terrible and two mugs were shattered.',
    status: 'Hidden',
    createdAt: '2024-10-23',
  },
  {
    id: '3',
    productName: 'Lumina Night Serum',
    productCategory: 'Beauty',
    reviewerName: 'Elena R.',
    isVerified: true,
    rating: 4,
    comment: 'Inappropriate language used in this review. Contains offensive content.',
    status: 'Reported',
    createdAt: '2024-10-21',
  },
  {
    id: '4',
    productName: 'Minimalist Smartwatch V2',
    productCategory: 'Electronics',
    reviewerName: 'David K.',
    isVerified: true,
    rating: 5,
    comment: 'Best smartwatch I\'ve ever owned. Battery lasts for days and the display is gorgeous.',
    status: 'Published',
    createdAt: '2024-10-20',
  },
  {
    id: '5',
    productName: 'Organic Green Tea',
    productCategory: 'Food & Beverage',
    reviewerName: 'Lisa W.',
    isVerified: false,
    rating: 2,
    comment: 'Not fresh. The tea arrived with a strange smell. Disappointed.',
    status: 'Hidden',
    createdAt: '2024-10-19',
  },
  {
    id: '6',
    productName: 'Yoga Mat Premium',
    productCategory: 'Sports & Outdoors',
    reviewerName: 'Alex M.',
    isVerified: true,
    rating: 4,
    comment: 'Good quality mat, non-slip and comfortable. Would recommend.',
    status: 'Published',
    createdAt: '2024-10-18',
  },
  {
    id: '7',
    productName: 'Wireless Charging Pad',
    productCategory: 'Electronics',
    reviewerName: 'John S.',
    isVerified: false,
    rating: 1,
    comment: 'Does not work with my phone. Charging is very slow. Waste of money.',
    status: 'Reported',
    createdAt: '2024-10-17',
  },
  {
    id: '8',
    productName: 'Bamboo Cutting Board',
    productCategory: 'Home & Kitchen',
    reviewerName: 'Maya R.',
    isVerified: true,
    rating: 5,
    comment: 'Great quality! Very sturdy and looks beautiful in my kitchen.',
    status: 'Published',
    createdAt: '2024-10-16',
  },
  {
    id: '9',
    productName: 'Facial Cleansing Brush',
    productCategory: 'Beauty',
    reviewerName: 'Tina L.',
    isVerified: true,
    rating: 3,
    comment: 'It works but the bristles are too harsh for sensitive skin.',
    status: 'Hidden',
    createdAt: '2024-10-15',
  },
  {
    id: '10',
    productName: 'Portable Power Bank',
    productCategory: 'Electronics',
    reviewerName: 'Ryan P.',
    isVerified: false,
    rating: 2,
    comment: 'Does not charge as advertised. Takes forever to charge my phone.',
    status: 'Reported',
    createdAt: '2024-10-14',
  },
  {
    id: '11',
    productName: 'Mechanical Keyboard',
    productCategory: 'Electronics',
    reviewerName: 'Emma S.',
    isVerified: true,
    rating: 5,
    comment: 'Excellent keyboard! The keys are responsive and the RGB lighting is awesome.',
    status: 'Published',
    createdAt: '2024-10-13',
  },
  {
    id: '12',
    productName: 'Glass Water Bottle',
    productCategory: 'Home & Kitchen',
    reviewerName: 'Tom H.',
    isVerified: true,
    rating: 4,
    comment: 'Beautiful bottle but the glass is a bit thin. Handle with care.',
    status: 'Published',
    createdAt: '2024-10-12',
  },
];