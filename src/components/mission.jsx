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
                setMissions(data)
            } catch (error) {
                console.log(error);
            }
        };
        dataFect()
    }, [])

    while (!missions) {
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
                                <div className='slide m-2
                                border-gray-300 rounded-md
                                w-[25vw] min-w-[250px] border-1
                                max-[800px]:w-50 max-[800px]:min-w-50
                                bg-[white]'>
                                    <img src={mission.image} alt="" className='rounded-t-md' />
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