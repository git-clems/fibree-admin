import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminMissionDetail = () => {
    const [mission, setMission] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/mission");
                const foundMission = response.data.find((e) => e._id === id);
                setMission(foundMission || null);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    const update = async (missionId) => {
        try {
            await axios.put(`http://localhost:8000/mission/${missionId}`)
        } catch (error) {
            console.log(error);
        }
    }

    while (!mission) {
        return <h2>Mission non retrouvée</h2>
    }

    return (
        <div className="page details-page">
            <div className="flex flex-wrap">
                <div className="ml-5 description">
                    <h2 className="name">Mission : {mission.title}</h2>
                </div>

                <div className="p-4 mt-4 bg-gray-100" style={{ float: 'left' }}>
                    <img src={mission.image} alt="" className="
                        rounded-2xl
                        border-1
                        border-gray-300
                        float-right
                        h-[300px]
                        max-w-[300px]
                        object-cover
                        bg-[red]
                        ml-4
                        mr-2
                        "/>
                    <p className="ml-2 mr-4 text-justify">{mission.description}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminMissionDetail;