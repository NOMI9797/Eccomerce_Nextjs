import { NextResponse } from "next/server";
import { Client, Storage, Databases, ID, Query } from "node-appwrite";

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679b0257003b758db270')
    .setKey('standard_81c36c20025dc7bfe9ed726a577c33686934c0943a630d7ebf93f9b51f107c31ca3bdcf7e7fdd5dfb73c6f21af630ac07bdc79a461a45839298bc515dfed9b5e17585c85e41139571af843c0f5700d1935e72a741ccf9221faca168c6e0821d39d0bd0a5cc45ab1edab7b5b5e1bcea3afca865abbb037b9418a609f3b81883ea');

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

        // Validate required fields
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
                        '67a32bbf003270b1e15c',
                        ID.unique(),
                        imageFile
                    );
                    return uploadedFile.$id;
                })
            );

            // Prepare product data with stock management fields
            const productData: any = {
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

            // Log the data being sent to createDocument
            console.log("Attempting to create document with data:", productData);

            // Create product with stock management fields
            const product = await databases.createDocument(
                '679b031a001983d2ec66',  // database ID
                '67a2fec400214f3c891b',  // collection ID
                ID.unique(),
                productData
            );

            return NextResponse.json(
                { 
                    message: "Product created successfully", 
                    product,
                    stockInfo: {
                        stock,
                        minStock,
                        maxStock,
                        trackStock,
                        status: stock <= 0 ? 'out_of_stock' : (stock <= minStock ? 'low_stock' : 'in_stock')
                    }
                },
                { status: 201 }
            );
        } catch (dbError: any) {
            // Enhanced error logging
            console.error("Database Error Details:", {
                message: dbError.message,
                type: dbError.type,
                code: dbError.code,
                response: dbError.response,
                stack: dbError.stack
            });

            return NextResponse.json(
                { 
                    error: "Database operation failed", 
                    details: dbError.message,
                    type: dbError.type,
                    code: dbError.code,
                    response: dbError.response
                },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Request Error:", {
            message: error.message,
            type: error.type,
            code: error.code,
            response: error.response,
            stack: error.stack
        });

        return NextResponse.json(
            { 
                error: "Failed to process request", 
                details: error.message,
                type: error.type,
                code: error.code,
                response: error.response
            },
            { status: 500 }
        );
    }
} 