import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';

const FlashInfo = ({ flashInfoId }) => {

    const [flashInfo, setInfo] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/flash");
                const foundFlashInfo = response.data.find((e) => e._id === flashInfoId);
                setInfo(foundFlashInfo || null);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [flashInfoId]);

    if (!flashInfo) {
        return null;
    }

    return (
        flashInfo.displayed &&
        <Link to={`/actualite/${flashInfo._id}`} className="hover:bg-red ">
            <div className='hover:bg-gray-200 flex flew-wrap border-t-1 overflow-hidden border-gray-300 flex-1 p-2'>
                <div className='w-[100px] h-[100px'>
                    <img src={flashInfo.image} alt="" className={`${flashInfo.image ? 'object-contain border-1 border-gray-300 rounded-md' : ''}`} />
                </div>
                <div className="flex-1 ml-2">
                    <div className='truncate max-w-[300px]'>{flashInfo.title}</div>
                    <div className="text-gray-400 truncate max-w-[300px]">{flashInfo.subtitle}</div>
                    {flashInfo.comingDate && <span>{flashInfo.comingDate}</span>}
                    {flashInfo.town && <span> {flashInfo.comingDate  && <span> - </span>} {flashInfo.town}</span>}
                </div>
            </div>
        </Link>
    )
}

export default FlashInfo