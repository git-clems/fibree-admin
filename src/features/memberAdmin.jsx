import React, { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import { useNavigate } from 'react-router'
import { PublishTime } from './admin'

const Loading = () => {
  return (
    <div className='w-full h-[100vh] flex justify-center items-center'>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

const AdminMembers = () => {
  const [members, setMembers] = useState()
  const [sortByDate, setSortByDate] = useState(false)
  const [sortByName, setSortByName] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')


  const filterMember = useMemo(() => {
    if (filter === 'suspended') {
      return members.filter(e => e.suspended)
    }
    if (filter === 'not_suspended') {
      return members.filter(e => !e.suspended)
    }
    return members
  }, [filter, members])

  useEffect(() => {
    const fectData = onSnapshot(collection(db, 'member'), snap => {
      const data = snap.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data()
      }))

      setMembers(data)
    })
    return () => fectData;
  }, [])

  const normalizedSearch = search.trim().toLowerCase()

  const searchedMember = useMemo(() => {
    if (!normalizedSearch) return filterMember
    return [...filterMember].filter((member) => (
      `${member.fname} ${member.lname} ${member.role} ${member.section}`.toLowerCase().includes(normalizedSearch)
    ))
  })

  while (!members) {
    return <Loading></Loading>
  }

  return (
    <div className='page'>
      <div className='mb-5'>
        <div className='flex flex-wrap items-center justify-between '>
          <div className='m-3'>
            <div className=''>
              <h4 className=''>
                {
                  members.length === 0
                    ? "Aucun membre"
                    : members.length === 1
                      ? "Un seul membre"
                      : `${members.length} membres au total`
                }
              </h4>
              {
                members.filter(e => e.suspended).length > 0 &&
                <div className='flex items-center'> <span> {members.filter(e => e.suspended).length} membres suspendus</span> <div className='bg-red-500 h-[10px] w-[10px] rounded-full ml-2'></div> </div>
              }
              <select class="form-select" autocomplete="suspended" id="suspended" required name="suspended" onChange={(e) => setFilter(e.target.value)}>
                <option value="">Tous</option>
                <option value="not_suspended">Actifs</option>
                <option value="suspended">Suspendus</option>
              </select>
            </div>
          </div>
          <form className="flex flex-1 flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 min-[800px]:m-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex w-full border-2 border-gray-300 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-blue-300 focus-within:border-white duration-50">
              <input type="search" placeholder="Nom, prénom, rôle, section..." value={search}
                onChange={(e) => {
                  e.preventDefault()
                  setSearch(e.target.value)
                }} className="border-l-none outline-none rounded-l-full h-[40px] pl-2 flex-1" />
              <div className="text-gray-400 pr-5 pl-5 border-gray-300 flex justify-center items-center"><i class="fa-solid fa-magnifying-glass"></i></div>
            </div>
          </form>
        </div>

        {
          <table class="flex-1 w-full text-sm">
            <thead className='bg-gray-600 text-white'>
              <tr>
                <th className="p-2">#</th>
                <th className="p-2"><button onClick={() => {
                  setSortByDate(null)
                  sortByName === null ?
                    setSortByName(false) :
                    setSortByName(!sortByName)
                }}>Nom complet {sortByName === true && <i class="fa-solid fa-sort-down"></i>}{sortByName === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
                <th>Rôle</th>
                <th className='max-[600px]:hidden'>Section</th>
                <th className="p-2 max-[600px]:hidden">
                  <button onClick={() => {
                    setSortByName(null)
                    sortByDate === null ?
                      setSortByDate(false) :
                      setSortByDate(!sortByDate)
                  }}>Depuis {sortByDate === true && <i class="fa-solid fa-sort-down"></i>}{sortByDate === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
              </tr>
            </thead>
            {!searchedMember?.length
              ? <div className='mt-5 text-center'>Aucun membre trouvé</div>
              : <tbody>
                {
                  searchedMember.sort((a, b) => {
                    if (sortByDate === false) {
                      return b.acceptedDate - a.acceptedDate
                    }
                    else if (sortByDate === true) {
                      return a.acceptedDate - b.acceptedDate
                    }
                    else if (sortByName === false) {
                      return a.lname.localeCompare(b.lname, 'fr')
                    }
                    else {
                      return b.lname.localeCompare(a.lname, 'fr')
                    }
                  }).map((member, index) => (
                    <tr key={member._id}
                      onClick={() => {
                        navigate(`/admin/membre/${member._id}`)
                      }}
                      className="cursor-pointer hover:bg-gray-200 transition border bg-[white]">
                      <th scope="row" className='p-2'>{index + 1}</th>
                      <td className='p-2'>
                        <div className='flex items-center truncate'>{member.lname.toUpperCase()} {member.fname} {member.suspended && <div className='ml-2 h-[10px] w-[10px] bg-red-500 rounded-full'></div>}</div>
                        <div className='min-[600px]:hidden text-gray-500'>{member.section}</div>
                      </td>
                      <td>
                        <span className='line-clamp-2'>{member.role}</span>
                      </td>
                      <td className='max-[600px]:hidden'>{member.section}</td>
                      <td className='p-2 max-[600px]:hidden'>
                        {PublishTime(member.acceptedDate)}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            }
          </table>
        }
      </div>
    </div>
  )
}

export default AdminMembers