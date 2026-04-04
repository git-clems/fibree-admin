import { useEffect, useState } from 'react'
// import './css/autoplayCarous.scss'
import axios from 'axios'

const Chiffre = ({ chiffreId }) => {
    const [chiffre, setChiffre] = useState(null)
    useEffect(() => {
        const dataFetch = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/partenaire')
                const foundChiffre = response.data.find((e) => e._id === chiffreId);
                setChiffre(foundChiffre || null);
            } catch (error) {
                console.log(error);
            }
        };
        dataFetch()
    }, [])

    if (!chiffre) {
        return null
    }
    return (
        <>
            {chiffre.displayed &&
                <div className='slide m-2 bg-white border-1 border-gray-300 rounded-3 flex items-center flex-col'>
                    <div className='mt-2 min-[800px]:m-2'>
                        <img src={chiffre.image} alt="" className='w-[20vw] h-[20vw] max-h-[150px] max-w-[150px] max-[800px]:w-[100px] max-[800px]:h-[100px] object-contain' />
                    </div>
                    <h1 className='text-red-300 mt-2'>10</h1>
                    <p className='w-[150px] text-center rounded-3 mt-'>{"Ville dans le monde"}</p>
                </div>}
        </>
    )
}


export default Chiffre