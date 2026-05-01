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
                <div className='max-w-[350px] m-2 min-w-[250px] w-[25vw] max-[600px]:w-100 bg-white m-2 border border-gray-500 rounded-md flex flex-col items-center p-2'>
                    <img src={statistic.image} alt="" className='w-50' />
                    <h2 className='font-bold pl-2 pr-2 w-[100%] text-center'>{statistic.metric}</h2>
                    <div className='pl-2 pr-2 text-gray-500 w-[100%] text-center'>{statistic.description}</div>
                </div>
            }
        </>
    )
}


export default Statistic