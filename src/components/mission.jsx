import { useEffect, useState } from 'react'
import './css/autoplayCarous.scss'
import axios from 'axios'
import { Link } from 'react-router'

const Missions = () => {
    const [missions, setMissions] = useState([])
    useEffect(() => {
        const dataFect = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/mission')
                setMissions(response.data)
            } catch (error) {
                console.log(error);
            }
        };
        dataFect()
    }, [])
    return (
        <>
            {(missions && missions.length > 0) &&
                <div class="wrapper w-200">
                    <div class="slider">
                        <div class="slide-track flex">
                            {missions.map((mission) => (
                                mission.displayed &&
                                <div className='slide m-2
                                border-gray-300 rounded-md
                                w-[25vw] min-w-[250px] border-1
                                max-[800px]:w-50 max-[800px]:min-w-50
                                bg-[white]'>
                                    <img src={mission.image} alt="" className='border- rounded-t-md' />
                                    <p className='font-bold p-2'>{mission.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}


export default Missions