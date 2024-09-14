"use client"
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useEffect } from "react"

export default function EditPage({ params }: { params: { id: string } }){
    const [formData, setFormData] = useState({ term: "", interpretation: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(`/api/interpretations/${params.id}`);
                if(!response.ok){
                    throw new Error("Failed to fetch Interpretation")
                }

                const data = await response.json();
                setFormData({ 
                    term: data?.interpretation?.term, 
                    interpretation: data?.interpretation?.interpretation
                });
            } catch (error){
                setError("Failed to load interpretation.")
            }
        }

        fetchData()
    }, [params.id])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!formData.term || !formData.interpretation){
            setError("Please fill in all the fileds");
            return;
        }

        setError(null);
        setIsLoading(true);

        try{
            const response = await fetch(`/api/interpretations/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if(!response.ok){
                throw new Error("Failed to update interpretation");
            }

            router.push("/")
        } catch(error){
            console.log(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div>
            <h2 className="text-2xl font-bold my-8">Edit Interpretation</h2>

            <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
                <input
                    type="text"
                    name="term"
                    placeholder="Term"
                    value={formData.term}
                    onChange={handleInputChange}
                    className="py-1 px-4 border rounded-md"
                />

                <textarea 
                    name="interpretation" 
                    rows={4}
                    placeholder="Interpretation"
                    value={formData.interpretation}
                    onChange={handleInputChange}
                    className="py-1 px-4 border rounded-md resize-none"
                ></textarea>

                <button 
                    className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Updating.." : "Update Interpretation"}
                </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
    )
}