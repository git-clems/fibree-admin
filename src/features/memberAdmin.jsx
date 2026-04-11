import React, { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
// import Loading from '../components/LoadingPage'
import { useNavigate } from 'react-router'

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

  const ToogleOppened = async (memberId) => {
    try {
      setMembers((prev) =>
        prev.map(member => (
          member._id === memberId ?
            { ...member, opened: true } : member
        ))
      )
      await updateDoc(doc(db, 'member', memberId), { opened: true })

    } catch (error) {
      console.log(error);
    }
  }

  const normalizedSearch = search.trim().toLowerCase()

  const searchedMember = useMemo(() => {
    if (!normalizedSearch) return filterMember
    return [...filterMember].filter((member) => (
      `${member.fname} ${member.lname}`.toLowerCase().includes(normalizedSearch)
    ))
  })

  while (!members) {
    return <Loading></Loading>
  }

  return (
    <div className='page'>
      {
        <div className='mb-5'>
          <div className='flex flex-wrap items-center justify-between '>
            <div className='m-3'>
              <div className=''>
                <h4 className=''>{members.length} membres</h4>
                <select class="form-select" autocomplete="suspended" id="suspended" required name="suspended" onChange={(e) => setFilter(e.target.value)}>
                  <option value="">Tous</option>
                  <option value="suspended">Suspendus</option>
                </select>
              </div>
              {
                members.filter(e => e.suspended).length > 0 &&
                <div className='flex items-center'><div className='bg-red-500 h-[10px] w-[10px] rounded-full mr-2'></div> <span> {members.filter(e => e.suspended).length} membres suspendus</span></div>
              }
            </div>
            <form className="flex flex-1 flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 min-[800px]:m-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex w-full border-2 border-gray-300 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-blue-300 focus-within:border-white duration-50">
                <input type="search" placeholder="Rechercher un nom" value={search}
                  onChange={(e) => {
                    e.preventDefault()
                    setSearch(e.target.value)
                  }} className="border-l-none outline-none rounded-l-full h-[40px] pl-2 flex-1" />
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
                  }}>Membre depuis le {sortByDate === true && <i class="fa-solid fa-sort-down"></i>}{sortByDate === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
              </tr>
            </thead>
            <tbody>
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
                      ToogleOppened(member._id)
                    }}
                    className="cursor-pointer hover:bg-gray-100 transition border bg-gray-100">
                    <th scope="row" className='p-2'>{index + 1}</th>
                    <td className='p-2 flex items-center'>
                      <span>{member.lname.toUpperCase()} {member.fname}</span> {member.suspended && <div className='ml-2 h-[10px] w-[10px] bg-red-500 rounded-full'></div>}
                    </td>
                    <td className='p-2'>
                      {member.acceptedDate?.toDate().toLocaleString('fr-FR')}
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

export default AdminMembers