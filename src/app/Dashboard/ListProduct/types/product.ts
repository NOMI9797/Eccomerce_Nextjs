import { Models } from 'appwrite';

export interface Product extends Models.Document {
    Name: string;
    Price: number;
    CategoryId: string;
    Description: string;
    Images: string[];    // Array of image IDs
    MainImage: string;   // Main image ID
} 