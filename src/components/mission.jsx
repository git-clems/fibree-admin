import { useEffect, useState } from 'react'
import './css/autoplayCarous.scss'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../auth/firebase'

const Missions = () => {
    const [missions, setMissions] = useState()
    useEffect(() => {
        const dataFect = async () => {
            try {
                const response = await getDocs(collection(db, 'mission'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                if (data) {
                    setMissions(data.filter(e => !e.removed))
                } else {
                    setMissions(null)
                }
            } catch (error) {
                console.log(error);
                setMissions(null)
            }
        };
        dataFect()
    }, [])

    if (!missions) {
        return (
            <div className='slide-track flex'>
                <div class="card w-55 min-h-50 m-2" aria-hidden="true">
                    <div class="card-body">
                        <h5 class="card-title placeholder-glow">
                            <span class="placeholder col-6"></span>
                        </h5>
                        <p class="card-text placeholder-glow">
                            <span class="placeholder col-7"></span>
                        </p>
                    </div>
                </div>
                <div class="card w-55 min-h-50 m-2" aria-hidden="true">
                    <div class="card-body">
                        <h5 class="card-title placeholder-glow">
                            <span class="placeholder col-6"></span>
                        </h5>
                        <p class="card-text placeholder-glow">
                            <span class="placeholder col-7"></span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {(missions && missions.length > 0) &&
                <div class="wrapper w-200">
                    <div class="slider">
                        <div class="slide-track flex">
                            {missions.map((mission) => (
                                mission.displayed &&
                                <div className='border rounded m-1 p-1 w-[25vw] min-w-[250px] flex flex-col bg-white justify-between'>
                                    <img src={mission.image} alt="" className='rounded-t-md w-[100%] h-[250px] object-contain' />
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