// components/UploadForm.js
"use client"
import { useState } from 'react';
import { storage, database } from "@/app/lib/appwrite_client";
import { ID } from "node-appwrite"


const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
const projectID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string;
const bucketID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID as string;
const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string


export default function UploadForm() {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('Please select a file.');
            return;
        }

        try {
            // Upload the image to Appwrite storage bucket
            const fileResponse = await storage.createFile(bucketID, ID.unique(), file);

            // Save form data and image URL to Appwrite database
            // https://cloud.appwrite.io/v1/storage/buckets/66e5f2460006fec2c1bd/files/66e60164001e1b41ece6/view?project=66c8a74a0024beac1b7a&project=66c8a74a0024beac1b7a&mode=admin
            const imageUrl = `${endpoint}/storage/buckets/${bucketID}/files/${fileResponse.$id}/view?project=${projectID}&project=${projectID}&mode=admin`;

            await database.createDocument(databaseID, '66e5f157003c65aaa37c', ID.unique(), {
                ...formData,
                imageUrl,
            });

            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        }
    };

    return (
        <form className='flex flex-col space-y-3' onSubmit={handleSubmit}>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                required
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
            />
            <input type="file" onChange={handleFileChange} required />
            <button className="text-white bg-black p-2 rounded-lg" type="submit">Upload</button>
        </form>
    );
}


//mine:  https://https//cloud.appwrite.io/v1/storage/buckets/66e5f2460006fec2c1bd/files/66e609ea00300ac109bf/view?project=66c8a74a0024beac1b7a&project=66c8a74a0024beac1b7a&mode=admin

// appwrite: https://cloud.appwrite.io/v1/storage/buckets/66e5f2460006fec2c1bd/files/66e609ea00300ac109bf/view?project=66c8a74a0024beac1b7a&project=66c8a74a0024beac1b7a&mode=admin