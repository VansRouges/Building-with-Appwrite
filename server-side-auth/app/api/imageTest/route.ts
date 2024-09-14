import { client } from "@/app/lib/appwrite_client";
import { Databases, ID, Query } from "node-appwrite"
import { NextResponse } from "next/server"

const database = new Databases(client)

async function fetchTest(){
    try{
        const response = await database.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, 
            '66e5f157003c65aaa37c', //imageTest collection id
            [
                Query.orderDesc("$createdAt")
            ]
        );

        return response.documents;
    }catch(error){
        console.log("Error fetching test", error);
        throw new Error("Failed to fetch test");
    }
}

export async function GET(){
    try{
        const uploadTest = await fetchTest();
        return NextResponse.json(uploadTest)
    }catch(error){
        return NextResponse.json(
            {error: "Failed to fetch interpretations"},
            {status: 500}
        );
    }
}
