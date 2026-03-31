import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminInfoDetail = () => {
    const [info, setInfo] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/info");
                const foundInfo = response.data.find((e) => e._id === id);
                setInfo(foundInfo || null);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    const update = async (infoId) => {
        try {
            await axios.put(`http://localhost:8000/infos/${infoId}`)
        } catch (error) {
            console.log(error);
        }
    }

    while (!info) {
        return <h2>Info non retrouvée</h2>
    }

    return (
        <div className="page details-page">
            <div className="flex flex-wrap">
                <div className="ml-5 description">
                    <h2 className="name">{info.title}</h2>
                    <p className="text-gray-500">{info.subtitle} </p>
                    <p className="text-gray-500">publié le {info.publishDate}</p>
                </div>

                <div className="p-4 mt-4 bg-gray-100" style={{ float: 'left' }}>
                    {
                        (info.images && info.images.length > 0) &&
                        <img src={info.images[0]} alt="" className="
                        rounded-2xl
                        border-1
                        border-gray-300
                        float-right
                        h-[300px]
                        object-cover
                        bg-[red]
                        ml-4
                        mr-2
                        "/>
                    }

                    <p className="ml-2 mr-4 text-justify">{info.description}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminInfoDetail;