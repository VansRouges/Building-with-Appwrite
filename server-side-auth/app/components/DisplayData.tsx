// components/DisplayData.js
"use client"
import { useState, useEffect } from 'react';
import { database } from  "@/app/lib/appwrite_client"; 


const databaseID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string

export default function DisplayData() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try{
                const response = await fetch("/api/imageTest");
                if(!response.ok){
                    throw new Error("Failed to fetch tests");
                }
                const data = await response.json();
                setItems(data);
            } catch(error){
                console.log("Error:", error);
                setError(
                    "Failed to load interpretations. Please try reloading the page"
                );
            } finally {
                setIsLoading(false);
            };
        }

        fetchData();
    }, []);

    console.log("Item:", items)

    return (
        <div>
            {items.map((item) => (
                <div key={item.$id}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <a href={item?.imageUrl} target="_blank">{item.imageUrl}</a>
                    <img width={200} height={200} src={item.imageUrl} alt={item.title} />
                </div>
            ))}
        </div>
    );
}
