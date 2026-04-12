import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loading from '../components/LoadingPage'
import Partenaires from '../components/partenaires'
import { Link } from 'react-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Page404 from '../pages/404'

const About = () => {

  const [about, setAbout] = useState()
  const [missions, setMissions] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const FetchData = async () => {
      setLoading(true)
      try {
        const responseAbout = await getDocs(collection(db, 'about'))
        const dataAbout = responseAbout.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data()
        }))
        const responseMission = await getDocs(collection(db, 'mission'))
        const dataMission = responseMission.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data()
        }))
        setAbout(dataAbout[0])
        setMissions(dataMission)
      } catch (error) {
        setAbout(null)
        setMissions(null)
      } finally {
        setLoading(false)
      }
    }
    FetchData()
  }, [])

  if (loading) return <Loading></Loading>
  if (!about) return <Page404></Page404>

  return (
    <div className='page'>
      <h2 className='m-3'>Qui sommes-nous ?</h2>

      <p lang='fr' className='min-[800px]:max-w-[50vw] min-[800px]:m-3 max-[800px]:m-3 text-justify text-justify [hyphens:auto]'>{about.about}</p>

      <section className='flex-wrap p-2 flex justify-around'>
        <div className='min-w-[300px] p-3 rounded-3'>
          <h4 className='flex justify-between'>Missions et valeurs</h4>
          <p className='min-[800px]:max-w-[50vw]'>{about.mission.description}</p>
          <ul>
            {
              missions.map((mission) => (
                <li key={mission._id}><i className="fa-solid fa-play text-green-300 mr-2"></i>{mission.title}</li>
              ))
            }
          </ul>

          <Link to={'/mission'} className="ml-5 bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
            <span className="text-nowrap">En savoir plus <i className="fa-solid fa-arrow-right"></i></span>
          </Link>
        </div>
        {
          about.mission.image &&
          <img src={about.mission.image} alt="" className='max-h-80 border-9 border-yellow-100 rounded-2xl' />
        }
      </section>


      <section className='flex-wrap p-2 flex justify-around mt-5'>
        {
          about.team.image &&
          <img src={about.team.image} alt="" className='max-h-80 border-9 border-yellow-100 rounded-2xl m-1' />
        }
        <div className='min-w-[300px] p-3 ml-5 rounded-3'>
          <h4 className='flex justify-between'>Equipe</h4>
          <p className='min-[800px]:max-w-[50vw]'>{about.team.description}</p>

          <Link to={'/equipe'} className="ml-5 bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
            <span className="text-nowrap">Voir toute l'équipe <i className="fa-solid fa-arrow-right"></i></span>
          </Link>
        </div>
      </section>


      <section className='flex-wrap p-2 flex justify-around mt-5'>
        <div className='min-w-[300px] p-3 ml-5 rounded-3'>
          <h4 className='flex justify-between'>Gouvernance</h4>
          <p className='min-[800px]:max-w-[50vw]'>{about.leadership.description}</p>

          <Link to={'/gouvernance'} className="bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
            <span className="text-nowrap">En savoir plus<i className="fa-solid fa-arrow-right"></i></span>
          </Link>
        </div>
        {about.leadership.image &&
          <img src={about.leadership.image} alt="" className='max-h-80 border-9 border-yellow-100 rounded-2xl m-1' />
        }
      </section>


      <section className='mt-5'>
        <h4 className='mt-3 ml-5'>Partenaires</h4>
        <p className='min-[800px]:max-w-[50vw] p-3'>{about.partnership.description}</p>
        <Partenaires></Partenaires>
      </section>

      <section className='mt-5 mb-5 flex flex-col justify-center items-center'>
        <h4 className='mt-3 mb-3'>Rapports</h4>
        <p className='p-2 text-center'>{about.reports.description}</p>

        <Link to={'/rapport'} className="ml-5 bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
          <span className="text-nowrap">Voir nos bilans <i className="fa-solid fa-arrow-right"></i></span>
        </Link>
      </section>
    </div>
  )
}

export default About