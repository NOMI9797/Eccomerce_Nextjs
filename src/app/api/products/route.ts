import { NextResponse } from "next/server";
import { Client, Storage, Databases, ID, Query } from "node-appwrite";

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679b0257003b758db270')
    .setKey('679b0257003b758db270679b0257003b758db270');

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

        // Validate required fields
        if (!name || !price || !categoryId || !description || imageFiles.length === 0) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
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

            // Create product with category reference
            const product = await databases.createDocument(
                '679b031a001983d2ec66',
                '67a2fec400214f3c891b',
                ID.unique(),
                {
                    Name: name,
                    Price: price,
                    CategoryId: categoryId,
                    Description: description,
                    Images: uploadedFileIds,
                    MainImage: uploadedFileIds[0]
                }
            );

            return NextResponse.json(
                { message: "Product created successfully", product },
                { status: 201 }
            );
        } catch (dbError: any) {
            console.error("Database Error:", dbError);
            return NextResponse.json(
                { error: "Database operation failed", details: dbError.message },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error("Request Error:", error);
        return NextResponse.json(
            { error: "Failed to process request", details: error.message },
            { status: 500 }
        );
    }
} 