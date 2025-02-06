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
        const categoryName = formData.get('category') as string;
        const description = formData.get('description') as string;
        const imageFiles = formData.getAll('images') as File[];

        // Validate required fields
        if (!name || !price || !categoryName || !description || imageFiles.length === 0) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        try {
            // First, check if category exists
            const categoryList = await databases.listDocuments(
                '679b031a001983d2ec66',  // Database ID
                '67a2ff0e0029b3db4449',  // Category Collection ID
                [Query.equal('CategoryName', categoryName)]
            );

            let categoryId;
            
            if (categoryList.documents.length === 0) {
                // Create new category if it doesn't exist
                const newCategory = await databases.createDocument(
                    '679b031a001983d2ec66',
                    '67a2ff0e0029b3db4449',
                    ID.unique(),
                    {
                        CategoryName: categoryName
                    }
                );
                categoryId = newCategory.$id;
            } else {
                categoryId = categoryList.documents[0].$id;
            }

            // Upload all images
            const uploadedFileIds = await Promise.all(
                imageFiles.map(async (imageFile) => {
                    const uploadedFile = await storage.createFile(
                        '67a32bbf003270b1e15c',  // Bucket ID
                        ID.unique(),
                        imageFile
                    );
                    return uploadedFile.$id;
                })
            );

            // Create product with multiple images
            const product = await databases.createDocument(
                '679b031a001983d2ec66',  // Database ID
                '67a2fec400214f3c891b',  // Products Collection ID
                ID.unique(),
                {
                    Name: name,
                    Price: price,
                    CategoryId: categoryId,
                    Description: description,
                    Images: uploadedFileIds,  // Store array of image IDs
                    MainImage: uploadedFileIds[0]  // First image as main image
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