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
        <div className="border-2 border-gray-300 flex-1 mt-1 rounded-1 bg-white p-2 flex justify-between">
            <div className="flex flew-wrap">
                <img src={flashInfo.image} alt="" className="h-[70px] w-[100px] object-contain float-right rounded-md" />
                <div className="ml-3 ">
                    <div className="hover:underline w-[max-content]">
                        <Link to={`/actualite/${flashInfo._id}`}>{flashInfo.title}</Link>
                    </div>
                    <span className="text-gray-400">{flashInfo.subtitle}</span>
                </div>
            </div>
            {
                flashInfo.externalLink &&
                <a href={flashInfo.externalLink} target="_blank" className="text-red-400"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            }
        </div>
    )
}

export default FlashInfo