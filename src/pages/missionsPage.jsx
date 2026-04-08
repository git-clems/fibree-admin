import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loading from '../components/LoadingPage'
import { Link } from 'react-router'

const Mission = () => {

    const [missions, setMissions] = useState([])

    useEffect(() => {
        const FetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/mission')
                setMissions(response.data)
            } catch (error) {
                console.log(error);
            }
        }
        FetchData()
    }, [])


    while (!missions || !missions) {
        return <Loading></Loading>
    }

    return (
        <div className='page'>
            <h2 className='m-3'>Nos missions</h2>
            {
                missions &&
                missions.map((mission, index) => (
                    index % 2 == 0 ?
                        <section className='flex flex-wrap justify-between m-2'>
                            <div className='flex-1 max-w-[1000px] min-w-[300px]'>
                                <h4><span className='text-orange-500'>{index + 1} - {mission.title}</span></h4>
                                <p className='pl-3'>{mission.description}</p>
                            </div>
                            <img src={mission.image} alt="" className='min-w-[200px] object-cover m-3 border-10 border-yellow-50 rounded-xl' />
                        </section> :
                        <section className='flex flex-wrap justify-between m-2'>
                            <img src={mission.image} alt="" className='min-w-[200px] object-cover m-3 border-10 border-yellow-50 rounded-xl' />
                            <div className='flex-1 max-w-[1000px] min-w-[300px]'>
                                <h4><span className='text-green-600'> {index + 1} - {mission.title}</span></h4>
                                <p className='ml-3'>{mission.description}</p>
                            </div>
                        </section>
                ))
            }
        </div>
    )
}

export default Mission