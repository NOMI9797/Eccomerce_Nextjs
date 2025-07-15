import { Models } from 'appwrite';

export interface Product extends Models.Document {
    Name: string;
    Price: number;
    CategoryId: string;
    Description: string;
    Images: string[];    // Array of image IDs
    MainImage: string;   // Main image ID
    
    // Stock Management Fields
    Stock: number;       // Current stock quantity
    MinStock: number;    // Minimum stock level for alerts (default: 5)
    MaxStock?: number;   // Maximum stock level (optional)
    TrackStock: boolean; // Enable/disable stock tracking (default: true)
}

// Stock status calculation helper
export const getStockStatus = (stock: number, minStock: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= minStock) return 'low_stock';
    return 'in_stock';
};

// Stock badge color helper
export const getStockBadgeColor = (status: string): string => {
    switch (status) {
        case 'in_stock': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
        case 'low_stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case 'out_of_stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
}; 