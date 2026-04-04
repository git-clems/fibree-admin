import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatDate } from '../features/adminInfos'

const Info = ({ infoId }) => {

    const [info, setInfo] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/info");
                const foundInfo = response.data.find((e) => e._id === infoId);
                setInfo(foundInfo || null);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [infoId]);


    if (!info) {
        return null;
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