import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../components/loadingPage"

const DetailsFlashInfo = () => {
    const [info, setFlashInfo] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/flash");
                const foundFlashInfo = response.data.find((e) => e._id === id);
                console.log(response.data);
                setFlashInfo(foundFlashInfo || null);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);
    
    while (!info) {
        return <Loading></Loading>
    }

    return (
        <div className="page details-page">
            <div className="flex flex-wrap">
                <div className="ml-5 description">
                    <h2 className="name">{info.title}</h2>
                    <span className="text-gray-500">{info.subtitle}</span>
                </div>
                
                <div className="p-4 mt-4 bg-gray-100" style={{ float: 'left' }}>
                    <img src={info.images[0]} alt="" className="
                        rounded-2xl
                        border-1
                        border-gray-300
                        float-right
                        h-[300px]
                        object-cover
                        ml-4 mr-2"/>
                    <p className="ml-2 mr-4 text-justify">{info.description}</p>
                </div>
            </div>
        </div>
    );
};

export default DetailsFlashInfo;