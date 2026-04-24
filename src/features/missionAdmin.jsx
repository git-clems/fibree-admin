import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'
import Page404 from '../pages/404'
import AddMission from '../Controllers/addMission'

const AdminMissions = () => {
  const [missions, setMissions] = useState()
  const [sortByDate, setSortByDate] = useState(false)
  const [sortByName, setSortByTitle] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  // const

  useEffect(() => {
    const fectData = async () => {
      try {
        onSnapshot(collection(db, 'mission'), snap => {
          const data = snap.docs.map((doc) => ({
            _id: doc.id,
            ...doc.data()
          }))
          setMissions(data.filter(e => !e.removed))
        })
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const deleteMission = async (missionId) => {
    setDeleting(true)
    try {
      await updateDoc(doc(db, 'mission', missionId), { removed: true })
    } catch (error) {
      return <Page404 message={'Une erreur est survenue'}></Page404>
    } finally {
      setDeleting(false)
    }
  }

  const ToogleOppened = async (missionId) => {
    try {
      await updateDoc(doc(db, 'mission', missionId), { opened: true })

    } catch (error) {
      console.log(error);
    }
  }


  const normalizedSearch = search.trim().toLowerCase()

  const filteredMission = useMemo(() => {
    if (!normalizedSearch) return missions
    return [...missions].filter((mission) => (
      `${mission.title}`.toLowerCase().includes(normalizedSearch)
    ))
  })

  if (!missions) return <Loading></Loading>

  return (
    <div className='page'>
      {
        <div className=''>
          <AddMission></AddMission>
          <div className='flex flex-wrap items-center justify-between '>
            <form className="flex flex-1 flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 min-[800px]:m-5 mt-0" onSubmit={(e) => e.preventDefault()}>
              <div className="flex w-full border-2 border-gray-300 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-blue-300 focus-within:border-white duration-50">
                <input type="search" placeholder="Rechercher un nom" value={search} onChange={(e) => setSearch(e.target.value)} className="border-l-none outline-none rounded-l-full h-[40px] pl-2 flex-1" />
                <div className="text-gray-400 pr-5 pl-5 border-gray-300 flex justify-center items-center"><i class="fa-solid fa-magnifying-glass"></i></div>
              </div>
            </form>
          </div>

          {
            <table class="flex-1 w-full text-sm">
              <thead className='bg-gray-600 text-white'>
                <tr>
                  <th scope="col" className="p-2">#</th>
                  <th scope="col" className="p-2"><button onClick={() => {
                    setSortByDate(null)
                    sortByName === null
                      ? setSortByTitle(false)
                      : setSortByTitle(!sortByName)
                  }}>Mission {sortByName === true && <i class="fa-solid fa-sort-down"></i>}{sortByName === false && <i class="fa-solid fa-sort-up"></i>}</button>
                  </th>
                  {/* <th className='max-[800px]:hidden'>Description</th> */}
                  <th></th>
                </tr>
              </thead>
              <tbody className=''>
                {
                  filteredMission.sort((a, b) => {
                    if (sortByDate === true) {
                      return a.missionDate - b.missionDate
                    }
                    else if (sortByDate === false) {
                      return b.missionDate - a.missionDate
                    }
                    else if (sortByName === true) {
                      return a.title.localeCompare(b.title, 'fr')
                    }
                    else {
                      return b.title.localeCompare(a.title, 'fr')
                    }
                  }).map((mission, index) => (
                    <tr key={mission._id} className='border'>
                      <th scope="row" className='p-2'>{index + 1}</th>
                      <td className='p-2 bg-red-00'>
                          <span className=''>{mission.title.toUpperCase()}</span> <br />
                          <span className='text-gray-400 line-clamp-2'>{mission.description}</span>
                      </td>

                      <td>
                        <button onClick={(e) => {
                          e.stopPropagation()
                          deleteMission(mission._id)
                        }} className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          }
        </div>
      }
    </div>
  )
}

export default AdminMissions