import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminAfficheDetail = () => {
    const [affiche, setAffiche] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/affiche");
                const foundAffiche = response.data.find((e) => e._id === id);
                setAffiche(foundAffiche || null);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    const update = async (afficheId) => {
        try {
            await axios.put(`http://localhost:8000/infos/${afficheId}`)
        } catch (error) {
            console.log(error);
        }
    }

    while (!affiche) {
        return <h2>Affiche non retrouvée</h2>
    }

    return (
        <div className="page details-page">
            <div className="flex flex-wrap">
                    <h2 className="name">{affiche.title}</h2>

                    <img src={affiche.images[0]} alt="" className="
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
            </div>
        </div>
    );
};

export default AdminAfficheDetail;