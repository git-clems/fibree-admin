import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../auth/firebase'

const Statistic = ({ statisticId }) => {
    const [statistic, setStatistic] = useState()
    useEffect(() => {
        const dataFetch = async () => {
            try {
                const response = await getDocs(collection(db, 'statistic'))
                const foundStatistic = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                setStatistic(foundStatistic.find(e => e._id === statisticId));
            } catch (error) {
                console.log(error);
            }
        };
        dataFetch()
    }, [])
    

    if (!statistic) {
        return null
    }
    return (
        <>
            {
                statistic.displayed &&
                <div className='slide m-2 bg-white border-1 border-gray-300 rounded-3 flex items-center flex-col'>
                    <div className='mt-2 min-[800px]:m-2'>
                        <img src={statistic.image} alt="" className='w-[20vw] h-[20vw] max-h-[150px] max-w-[150px] max-[800px]:w-[100px] max-[800px]:h-[100px] object-contain' />
                    </div>
                    <h1 className='text-red-300 mt-2'>{statistic.value}</h1>
                    <p className='w-[150px] text-center rounded-3 mt-'>{statistic.description}</p>
                </div>
            }
        </>
    )
}


export default Statistic