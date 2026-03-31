import { useEffect, useState } from 'react'
// import './css/autoplayCarous.scss'
import axios from 'axios'

const Partenaires = () => {
    const [partenaires, setPartenaires] = useState([])
    useEffect(() => {
        const dataFect = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/partenaire')
                setPartenaires(response.data)
            } catch (error) {
                console.log(error);
            }
        };
        dataFect()
    }, [])
    return (
        <>
            {(partenaires && partenaires.length > 0) &&
                <div class="flex min-[800px]:flex-wrap overflow-x-auto overflow-y-hidden duration-200 ">
                    {partenaires.map((partenaire) => (
                        partenaire.displayed &&
                        <div className='slide m-2 flex items-center flex-col'>
                            <img src={partenaire.image} alt="" className='h-[200px] w-[200px] object-contain border-2 border-gray-200 rounded-md' />
                            <p className='w-[200px] p-2 text-center'>{partenaire.name}</p>
                        </div>
                    ))}
                </div>
            }
        </>
    )
}


export default Partenaires