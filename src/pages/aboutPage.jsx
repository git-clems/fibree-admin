import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loading from '../components/LoadingPage'
import Partenaires from '../components/partenaires'
import { Link } from 'react-router'

const About = () => {

  const [about, setAbout] = useState()

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/about')
        setAbout(response.data[0])
      } catch (error) {
        console.log(error);
      }
    }
    FetchData()
  }, [])
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


  while (!about || !missions) {
    return <Loading></Loading>
  }

  return (
    <div className='page'>
      <h2 className='m-3'>Qui sommes-nous ?</h2>

      <p className='min-[800px]:max-w-[50vw] min-[800px]:m-3 max-[800px]:m-3 text-justify'>{about.about}</p>

      <section className='flex-wrap p-2 flex justify-around'>
        <div className='min-w-[300px] p-3 rounded-3'>
          <h4 className='flex justify-between'>
            Missions et valeurs
          </h4>
          <p className='min-[800px]:max-w-[50vw]'>{about.mission.description}</p>
          <ul>
            {
              missions.map((mission) => (
                <li><i class="fa-solid fa-play text-green-300 mr-2"></i>{mission.title}</li>
              ))
            }
          </ul>

          <Link to={'/mission'} className="ml-5 bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
            <span className="text-nowrap">En savoir plus <i class="fa-solid fa-arrow-right"></i></span>
          </Link>
        </div>
        {about.mission.image &&
          <img src={about.mission.image} alt="" className='max-h-80 border-9 border-yellow-100 rounded-2xl' />
        }
      </section>


      <section className='flex-wrap p-2 flex justify-around mt-5'>
        {about.team.image &&
          <img src={about.team.image} alt="" className='max-h-80 border-9 border-yellow-100 rounded-2xl m-1' />
        }
        <div className='min-w-[300px] p-3 ml-5 rounded-3'>
          <h4 className='flex justify-between'>
            Equipe
          </h4>
          <p className='min-[800px]:max-w-[50vw]'>{about.team.description}</p>

          <Link to={'/equipe'} className="ml-5 bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
            <span className="text-nowrap">Voir toute l'équipe <i class="fa-solid fa-arrow-right"></i></span>
          </Link>
        </div>
      </section>


      <section className='flex-wrap p-2 flex justify-around mt-5'>
        <div className='min-w-[300px] p-3 ml-5 rounded-3'>
          <h4 className='flex justify-between'>
            Gouvernance
          </h4>
          <p className='min-[800px]:max-w-[50vw]'>{about.leadership.description}</p>

          <Link to={'/gouvernance'} className="ml-5 bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
            <span className="text-nowrap">Connaître mieux notre gouvernance<i class="fa-solid fa-arrow-right"></i></span>
          </Link>
        </div>
        {about.leadership.image &&
          <img src={about.leadership.image} alt="" className='max-h-80 border-9 border-yellow-100 rounded-2xl m-1' />
        }
      </section>


      <section className='mt-5'>
        <p className='min-[800px]:max-w-[50vw] p-3'>
          <h4 className='mt-3 text-center'>Partenaires</h4>
          {about.partnership.description}
        </p>
        <Partenaires></Partenaires>
      </section>

      <section className='mt-5 mb-5 flex flex-col justify-center items-center'>
        <h4 className='mt-3 mb-3'>Rapports</h4>
        <p className='p-2'>{about.reports.description}</p>

        <Link to={'/rapport'} className="ml-5 bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
          <span className="text-nowrap">Voir nos bilans <i class="fa-solid fa-arrow-right"></i></span>
        </Link>
      </section>
    </div>
  )
}

export default About