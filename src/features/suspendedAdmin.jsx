import React, { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'
import { useNavigate } from 'react-router'
import { PublishTime } from './admin'


const AdminSuspended = () => {
  const [suspended, setSuspended] = useState()
  const [sortByDate, setSortByDate] = useState(false)
  const [sortByName, setSortByName] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  // const

  useEffect(() => {
    const fectData = onSnapshot(collection(db, 'member'), snap => {
      if (snap) {
        const data = snap.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data()
        }))
        setSuspended(data.filter(e => e.suspended))
      } else {
        setSuspended(null)
      }
      setLoading(false)
    },
      err => {
        setSuspended(null)
        setLoading(false)
      })

    return () => fectData();
  }, [])


  const normalizedSearch = search.trim().toLowerCase()

  const filteredSuspended = useMemo(() => {
    if (!normalizedSearch) return suspended
    return [...suspended].filter((suspended) => (
      `${suspended.fname} ${suspended.lname}`.toLowerCase().includes(normalizedSearch)
    ))
  })

  if (loading) return <Loading></Loading>

  return (
    <div className='page'>
      {
        <div className='mb-5'>
          <div className='flex flex-wrap items-center justify-between '>
            <h4 className='m-3'>
              {
                suspended.length === 0
                  ? "Aucun membre suspendu"
                  : suspended.length === 1
                    ? "Un membre suspendu"
                    : `${suspended.length} membres suspendus`
              }
            </h4>
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
                  }}>Suspendu{sortByDate === true && <i class="fa-solid fa-sort-down"></i>}{sortByDate === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                filteredSuspended.sort((a, b) => {
                  if (sortByDate === true) {
                    return a.suspendedtDate - b.suspendedtDate
                  }
                  else if (sortByDate === false) {
                    return b.suspendedtDate - a.suspendedtDate
                  }
                  else if (sortByName === true) {
                    return a.fname.localeCompare(b.fname, 'fr')
                  }
                  else {
                    return b.fname.localeCompare(a.fname, 'fr')
                  }
                }).map((suspended, index) => (
                  <tr key={suspended._id}
                    onClick={() => {
                      navigate(`/admin/membre/${suspended._id}`)
                    }}
                    className="cursor-pointer hover:bg-gray-100 transition border">
                    <th scope="row" className='p-2'>{index + 1}</th>
                    <td className='p-2'>
                      {suspended.fname} {suspended.lname}
                    </td>
                    <td className='p-2'>
                      {/* {suspended.suspendedtDate?.toDate().toLocaleString('fr-FR')} */}
                      {PublishTime(suspended.suspendedtDate)}
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

export default AdminSuspended