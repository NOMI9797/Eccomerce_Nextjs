import { NextResponse } from "next/server";
import { Client, Storage, Databases, ID } from "node-appwrite";

// Type for product data being sent to database
interface ProductData {
    Name: string;
    Price: number;
    CategoryId: string;
    Description: string;
    Images: string[];
    MainImage: string;
    Stock: number;
    MinStock: number;
    MaxStock?: number;
    TrackStock: boolean;
}

// Initialize Appwrite
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

const storage = new Storage(client);
const databases = new Databases(client);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        
        // Extract product data from form
        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const categoryId = formData.get('category') as string;
        const description = formData.get('description') as string;
        const imageFiles = formData.getAll('images') as File[];
        
        // Extract stock management fields
        const stock = parseInt(formData.get('stock') as string) || 0;
        const minStock = parseInt(formData.get('minStock') as string) || 5;
        const maxStock = formData.get('maxStock') ? parseInt(formData.get('maxStock') as string) : null;
        const trackStock = formData.get('trackStock') === 'true';

        if (!name || !price || !categoryId || !description || imageFiles.length === 0) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate stock fields if stock tracking is enabled
        if (trackStock) {
            if (stock < 0) {
                return NextResponse.json(
                    { error: "Stock quantity cannot be negative" },
                    { status: 400 }
                );
            }

            if (minStock < 0) {
                return NextResponse.json(
                    { error: "Minimum stock level cannot be negative" },
                    { status: 400 }
                );
            }

            if (maxStock !== null && maxStock < minStock) {
                return NextResponse.json(
                    { error: "Maximum stock level cannot be less than minimum stock level" },
                    { status: 400 }
                );
            }

            if (maxStock !== null && stock > maxStock) {
                return NextResponse.json(
                    { error: "Current stock cannot exceed maximum stock level" },
                    { status: 400 }
                );
            }
        }

        try {
            // Upload all images
            const uploadedFileIds = await Promise.all(
                imageFiles.map(async (imageFile) => {
                    const uploadedFile = await storage.createFile(
                        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
                        ID.unique(),
                        imageFile
                    );
                    return uploadedFile.$id;
                })
            );

            // Prepare product data with stock management fields
            const productData: ProductData = {
                Name: name,
                Price: price,
                CategoryId: categoryId,
                Description: description,
                Images: uploadedFileIds,
                MainImage: uploadedFileIds[0],
                Stock: stock,
                MinStock: minStock,
                TrackStock: trackStock
            };

            // Add MaxStock only if it's provided
            if (maxStock !== null) {
                productData.MaxStock = maxStock;
            }

            // Create product with stock management fields
            const product = await databases.createDocument(
                process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
                ID.unique(),
                productData
            );

            return NextResponse.json(
                { 
                    message: "Product created successfully", 
                    product,
                    stockInfo: {
                        currentStock: stock,
                        minStock,
                        maxStock,
                        trackStock
                    }
                },
                { status: 201 }
            );
        } catch (error) {
            console.error('Error creating product:', error);
            return NextResponse.json(
                { error: "Failed to create product" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 