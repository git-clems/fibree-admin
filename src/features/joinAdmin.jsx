import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'
import { PublishTime } from './admin'


const AdminJoins = () => {
  const [joins, setJoins] = useState()
  const [sortByDate, setSortByDate] = useState(false)
  const [sortByName, setSortByName] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fectData = async () => {
      try {

        onSnapshot(collection(db, 'join'), snap => {
          const data = snap.docs.map((doc) => ({
            _id: doc.id,
            ...doc.data()
          }))
          setJoins(data.filter(e => !data.accepted))
        }
        )
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])


  const ToogleOppened = async (joinId) => {
    try {
      setJoins((prev) =>
        prev.map(join => (
          join._id === joinId ? { ...join, opened: true } : join
        ))
      )
      await updateDoc(doc(db, 'join', joinId), { opened: true })

    } catch (error) {
      console.log(error);
    }
  }

  const normalizedSearch = search.trim().toLowerCase()

  const filteredJoin = useMemo(() => {
    if (!normalizedSearch) return joins
    return [...joins].filter((join) => (
      `${join.fname} ${join.lname}`.toLowerCase().includes(normalizedSearch)
    ))
  })

  while (!joins) {
    return <Loading></Loading>
  }

  return (
    <div className='page'>
      {
        <div className='mb-5'>
          <div className='flex flex-wrap items-center justify-between '>
            <h4 className='m-3'>{joins.filter(e => !e.accepted).length === 0 && "Acune demande d'adhésion en attente"} {joins.filter(e => !e.accepted).length === 1 && "Une demande d'adhésion en attente"} {joins.filter(e => !e.accepted).length > 1 && <span>{joins.filter(e => !e.accepted).length} demandes d'adhésion en attente</span>}</h4>
            <form className="flex flex-1 flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 min-[800px]:m-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex w-full border-2 border-gray-300 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-blue-300 focus-within:border-white duration-50">
                <input type="search" placeholder="Rechercher un nom" value={search} onChange={(e) => setSearch(e.target.value)} className="border-l-none outline-none rounded-l-full h-[40px] pl-2 flex-1" />
                <div className="text-gray-400 pr-5 pl-5 border-gray-300 flex justify-center items-center"><i class="fa-solid fa-magnifying-glass"></i></div>
              </div>
            </form>
          </div>

          {<table class="flex-1 w-full text-sm">
            <thead className='bg-gray-600 text-white'>
              <tr>
                <th scope="col" className="p-2">#</th>
                <th scope="col" className="p-2"><button onClick={() => {
                  setSortByDate(null)
                  sortByName === null ?
                    setSortByName(false) :
                    setSortByName(!sortByName)
                }}>Nom complet {sortByName === true && <i class="fa-solid fa-sort-down"></i>}{sortByName === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
                <th scope="col" className="p-2">
                  <button onClick={() => {
                    setSortByName(null)
                    sortByDate === null ?
                      setSortByDate(false) :
                      setSortByDate(!sortByDate)
                  }}>Date {sortByDate === true && <i class="fa-solid fa-sort-down"></i>}{sortByDate === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
                {/* <th>Accepté</th> */}
              </tr>
            </thead>
            <tbody>
              {
                filteredJoin.sort((a, b) => {
                  if (sortByDate === true) {
                    return a.joinDate - b.joinDate
                  }
                  else if (sortByDate === false) {
                    return b.joinDate - a.joinDate
                  }
                  else if (sortByName === true) {
                    return a.fname.localeCompare(b.fname, 'fr')
                  }
                  else {
                    return b.fname.localeCompare(a.fname, 'fr')
                  }
                }).filter(e => !e.accepted).map((join, index) => (
                  <tr key={join._id}
                    onClick={() => {
                      navigate(`/admin/nouveau-membre/${join._id}`)
                      ToogleOppened(join._id)
                    }}
                    className={`cursor-pointer hover:bg-gray-100 transition border ${join.opened && 'bg-sky-50'}`}
                  >
                    <th scope="row" className='p-2'>{index + 1}</th>
                    <td className='p-2'>
                      {join.fname} {join.lname.toUpperCase()}
                    </td>
                    <td className='p-2'>
                      {PublishTime(join.joinDate)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>}
        </div>
      }
    </div>
  )
}

export default AdminJoins