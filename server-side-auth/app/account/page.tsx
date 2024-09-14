// src/app/account/page.jsx
"use client"
import Link from "next/link"
import { useState, useEffect } from 'react'

import {
    getLoggedInUser,
  } from "@/app/lib/server/appwrite";
  import { redirect } from "next/navigation";

  interface IInterpretation{
    $id: string;
    term: string;
    interpretation: string;
  }
  
  interface User{

  }
  
  
  export default function HomePage() {
    const [user, setUser] = useState<any>();
    const [interpretations, setInterpretations] = useState<IInterpretation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const userDetails = async () =>{
        try{
          const user = await getLoggedInUser();
          if (!user) redirect("/signup");
          setUser(user);
        } catch(error){
          setError(
            "Failed to load user. Please try reloading the page"
          )
        }
        
      }

      console.log("User details:", user)

      const fetchInterpretations = async () => {
        setIsLoading(true);
        try{
          const response = await fetch("/api/interpretations");
          if(!response.ok){
            throw new Error("Failed to fetch interpretations");
          }
          const data = await response.json();
          setInterpretations(data);
        } catch(error){
          console.log("Error:", error);
          setError(
            "Failed to load interpretations. Please try reloading the page"
          );
        } finally {
          setIsLoading(false);
        }
      }

      userDetails()
      fetchInterpretations()
    }, []);
  
    const handleDelete = async (id: string) => {
      try{
        await fetch(`/api/interpretations/${id}`, { method: "DELETE" });
        setInterpretations((prevInterpretations) =>
          prevInterpretations?.filter((i) => i.$id !== id)
      );
      } catch(error){
        setError("Failed to delete interpretation. Please try again.")
      }
    }

    return (
      <div>
        <h1 className="heading-level-1">Hello {user?.name},</h1>
        {error && <p className="py-4 text-red-500">{error}</p>}
        {isLoading ? (
          <p>Loading interpretations...</p>
        ) : interpretations?.length > 0 ? (
          <div>
            {
              interpretations?.map((interpretation) => (
                <div className="p-4 my-2 rounded-md border-b leading-8" key={interpretation?.$id}>
                  <div className="font-bold">{interpretation?.term}</div>
                  <div>
                    {interpretation?.interpretation}
                  </div>

                  <div className="flex gap-4 mt-4 justify-end">
                    <Link className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest" href={`/account/edit/${interpretation?.$id}`}>edit</Link>
                    <button 
                      onClick ={() => handleDelete(interpretation.$id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        ) : (
          <p>No Interpretations Found</p>
        )}
      </div>
    );
  }
  

  // <ul>
  //         <li>
  //           <strong>Email:</strong> {user.email}
  //         </li>
  //         <li>
  //           <strong>Name:</strong> 
  //         </li>
  //         <li>
  //           <strong>ID: </strong> {user.$id}
  //         </li>
  //       </ul>