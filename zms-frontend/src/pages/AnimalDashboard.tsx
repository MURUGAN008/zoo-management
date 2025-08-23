import axios from "axios";
import { useEffect,useState } from "react"
import { dummyAnimals } from "@/components/custom/dummyAnimals";
import { useNavigate } from "react-router-dom";
const animalDashboard = () =>{
    const [isLoading,setIsLoading]=useState(false);//change it to  true togive load effect
    const navigate=useNavigate();
    interface Animal{
        id:string,
        species:string,
        gender:string,
        isChild:boolean,
        age:number,
        weight:number,
        createdAt:string,
        updatedAt:string
    }
    const [animals,setAnimals]=useState<Animal[]>(dummyAnimals);
    useEffect(()=>{
        const fetchAnimals=async()=>{
            try{
                const response=await axios.get("http://localhost:3000/api/animal/getAll",{
                    withCredentials:true
                });
                if(response.status===200){
                    setAnimals(response.data.animals);
                    setIsLoading(false);
                }   
            }catch(err){
                console.error(err);
            }
        };
        fetchAnimals();
    },[]);
    const handleDelete=async(animalId:string)=>{
        try{
            const response=await axios.delete(`http://localhost:3000/api/animal/delete/${animalId}`,{
                withCredentials:true
            })
            if(response.status===200){
                alert("Animal deleted successfully");
                setAnimals(animals.filter(animal=>animal.id!==animalId));
            }
            else{
                alert("Failed to delete animal");
            }
        }
        catch(err){console.error(err)};
    }
    return (
        <div className="w-full flex flex-col items-center justify-center py-8">
            {isLoading ? (
                <p className="text-lg text-[var(--primary-color)]">Loading animals...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                    {animals.map((animal) => (
                        <div
                            key={animal.id}
                            className="bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl shadow-lg p-6 flex flex-col gap-2 hover:scale-105 transition-transform duration-200"
                        >
                            <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-1 capitalize">{animal.species}</h2>
                            <div className="flex flex-wrap gap-2 text-[var(--foreground)]">
                                <span className="px-2 py-1 rounded bg-[var(--muted)] text-xs font-semibold">Gender: {animal.gender}</span>
                                <span className="px-2 py-1 rounded bg-[var(--muted)] text-xs font-semibold">{animal.isChild ? 'Child' : 'Adult'}</span>
                            </div>
                            <div className="flex gap-4 mt-2">
                                <span className="text-sm">Age: <span className="font-semibold">{animal.age} yrs</span></span>
                                <span className="text-sm">Weight: <span className="font-semibold">{animal.weight} kg</span></span>
                            </div>
                            <div className="flex flex-col mt-2 text-xs text-[var(--muted-foreground)]">
                                <span>Created: {new Date(animal.createdAt).toLocaleDateString()}</span>
                                <span>Updated: {new Date(animal.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <button className="bg-[var(--warning-color)] rounded py-2 my-1 hover:translate-y-0.5 duration-100 cursor-pointer hover:scale-99 text-black" onClick={()=>navigate("/update/animal",{state: animal})}>Update</button>
                            <button className="bg-[var(--danger-color)] rounded py-2 my-1 hover:translate-y-0.5 duration-100 cursor-pointer hover:scale-99 text-bold" onClick={()=>handleDelete(animal.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default animalDashboard;