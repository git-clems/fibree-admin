import { useEffect, useState } from 'react'
import { Link } from 'react-router';
import { db } from '../auth/firebase';
import { collection, getDocs } from 'firebase/firestore';

const FlashInfo = ({ flashInfoId }) => {

    const [flashInfo, setInfo] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDocs(collection(db, 'flash-info'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                setInfo(data.find((e) => e._id === flashInfoId));
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [flashInfoId]);

    while (!flashInfo) {
        return (
            <div class="card" aria-hidden="true">
                <div class="card-body">
                    <h5 class="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                    </h5>
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-7"></span>
                    </p>
                </div>
            </div>
        );
    }

    // console.log();


    return (
        flashInfo.displayed &&
        <Link to={`/flash-info/${flashInfo._id}`} className="">
            <div className='hover:bg-gray-200 flex flew-wrap border-t-1 overflow-hidden border-gray-300 flex-1 p-2'>
                <div className='w-[100px] h-[100px'>
                    <img src={flashInfo.image} alt="" className={`${flashInfo.image ? 'object-contain border-1 border-gray-300 rounded-md' : ''}`} />
                </div>
                <div className="flex-1 ml-2">
                    <div className='truncate max-w-[300px]'>{flashInfo.title}</div>
                    <div className="text-gray-400 truncate max-w-[300px]">{flashInfo.subtitle}</div>
                </div>
            </div>
        </Link>
    )
}

export default FlashInfo