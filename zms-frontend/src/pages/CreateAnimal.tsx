import React,{useState} from "react"
import axios from "axios";
type genderType = "MALE" | "FEMALE"

type Animal={
    species:string,
    gender:genderType,
    isChild: boolean,
    age:string,
    weight:string
}
const CreateAnimal = () => {
    const [animal,setAnimal]=useState<Animal>({
        species:"",
        gender:"MALE",  
        // here genderType is used so not able to assign any other value so set "MALE" as a default value
        isChild:false,
        age:"",
        weight:""
    })
    const  handleGender = (e:React.ChangeEvent<HTMLSelectElement>) =>{
        setAnimal({...animal,gender:e.target.value as genderType});
    }
    const handleSubmit =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        // console.log(animal);
        if(!animal.species.length || !animal.age.length || !animal.weight.length){
            alert("Please fill all the fields");
            return;
        }

        const dataToSend={
            ...animal,
            age:Number(animal.age),
            weight:Number(animal.weight)
        }
        try{
            const response = await axios.post("http://localhost:3000/api/animal/create",dataToSend,{
                withCredentials:true
            });
            if(response.status===201){
                alert("Animal created successfully");
                setAnimal({
                    species:"",
                    gender:"MALE",
                    isChild:false,
                    age:"",
                    weight:""
                })
            }
            else{
                alert("Failed to create animal with error"+response.data.message.toString());
            }
        }
        catch(err) {console.error(err)};

    }
    return (
        <div className="w-full flex items-center justify-center bg-[var(--background)] py-8">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-[var(--card)] border-2 border-[var(--border)] rounded-2xl shadow-lg p-12 flex flex-col gap-8 animate-slide-down mx-auto"
            >
                <h2 className="text-3xl font-extrabold text-center mb-2 text-[var(--primary-color)]">Create Animal</h2>
                <div className="flex flex-col gap-1">
                    <label htmlFor="Species" className="font-semibold text-[var(--primary-color)]">Name</label>
                    <input
                        type="text"
                        id="Species"
                        name="species"
                        placeholder="African Lion"
                        value={animal.species}
                        onChange={e => setAnimal({ ...animal, [e.target.name]: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="gender" className="font-semibold text-[var(--primary-color)]">Gender</label>
                    <select
                        name="gender"
                        id="gender"
                        value={animal.gender}
                        onChange={handleGender}
                        className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        required
                    >
                        <option value="" disabled>Choose a gender</option>
                        <option value="MALE">MALE</option>
                        <option value="FEMALE">FEMALE</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="age" className="font-semibold text-[var(--primary-color)]">Age(In Years)</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        placeholder="1"
                        value={animal.age}
                        onChange={e => setAnimal({ ...animal, age: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        min="0"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="weight" className="font-semibold text-[var(--primary-color)]">Weight (kg)</label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        placeholder="20.5678"
                        value={animal.weight}
                        onChange={e => setAnimal({ ...animal, weight: e.target.value })}
                        className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        min="0"
                        step="any"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="mt-2 px-6 py-3 rounded-lg font-bold bg-[var(--accent-color)] text-[var(--accent-foreground)] shadow-md hover:bg-[var(--primary-color)] hover:text-[var(--primary-foreground)] transition-colors duration-200 hover:cursor-pointer"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export  default CreateAnimal;
