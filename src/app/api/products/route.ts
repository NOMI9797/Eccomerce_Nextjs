import { NextResponse } from "next/server";
import { Client, Storage, Databases, ID, Query } from "node-appwrite";

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679b0257003b758db270')
    .setKey('679b0257003b758db270679b0257003b758db270'); // Your API key

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
                    '679b031a001983d2ec66',  // Database ID
                    '67a2ff0e0029b3db4449',  // Category Collection ID
                    ID.unique(),
                    {
                        CategoryName: categoryName
                    }
                );
                categoryId = newCategory.$id;
            } else {
                // Use existing category
                categoryId = categoryList.documents[0].$id;
            }

            // Upload the first image only (maintaining single image compatibility)
            const uploadedFile = await storage.createFile(
                '67a32bbf003270b1e15c',  // Bucket ID
                ID.unique(),
                imageFiles[0]  // Use only the first image
            );

            // Create product with category reference
            const product = await databases.createDocument(
                '679b031a001983d2ec66',  // Database ID
                '67a2fec400214f3c891b',  // Products Collection ID
                ID.unique(),
                {
                    Name: name,
                    Price: price,
                    CategoryId: categoryId,
                    Description: description,
                    Image: uploadedFile.$id  // Store single image ID
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