import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatDate } from '../features/adminInfos'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../auth/firebase'

const Info = ({ infoId }) => {

    const [info, setInfo] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDocs(collection(db, 'infos'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                const foundInfo = data.find((e) => e._id === infoId)
                setInfo(foundInfo || null);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [infoId]);


    while (!info) {
        return (
            <div class="card m-3 h-[450px] w-[300px] border-1 border-gray-300 rounded-md bg-[white] hover:shadow-[0_0_15px_rgba(0,0,25,0.9)] transition-shadow duration-200 overflow-hidden" aria-hidden="true">
                <div class="card-body">
                    <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h5>
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-7"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-4"></span>
                        <span class="placeholder col-6"></span>
                        <span class="placeholder col-8"></span>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            {info.displayed &&
                <Link to={`/actualite/${infoId}`} className='m-3 max-h-[450px] w-[25vw] min-w-[300px] border-1 border-gray-300 rounded-md bg-[white] hover:shadow-[0_0_15px_rgba(0,0,25,0.9)] transition-shadow duration-200 overflow-hidden'>
                    <img src={info.images[0]} alt="" className='rounded-t-md h-[200px] w-[100%] object-cover' />
                    <div className='m-2'>
                        <span className='font-bold pt-2 pb-4'>{info.title}</span>
                        <br />
                        <span className='text-gray-500'>Publié le {formatDate(info.publishDate)}</span>
                        <p className='text-sm text-[gray]'> {info.subtitle} </p>
                    </div>
                </Link>
            }
        </>
    )
}

export default Info