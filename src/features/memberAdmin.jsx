import React, { useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'
import { useNavigate } from 'react-router'


const AdminMembers = () => {
  const [members, setMembers] = useState()
  const [sortByDate, setSortByDate] = useState(false)
  const [sortByName, setSortByName] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  // const

  useEffect(() => {
    const fectData = async () => {
      try {
        onSnapshot(collection(db, 'member'), snap => (
          setMembers(snap.docs.map((doc) => ({
            _id: doc.id,
            ...doc.data()
          })))
        ))
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  // const deleteMember = async (memberId) => {
  //   await deleteDoc(doc(db, 'member', memberId)).catch((err) => {
  //     console.log(err);
  //   })
  // }

  const ToogleOppened = async (memberId) => {
    try {
      setMembers((prev) =>
        prev.map(member => (
          member._id === memberId ? { ...member, opened: true } : member
        ))
      )
      await updateDoc(doc(db, 'member', memberId), { opened: true })

    } catch (error) {
      console.log(error);
    }
  }

  const normalizedSearch = search.trim().toLowerCase()

  const filteredMember = useMemo(() => {
    if (!normalizedSearch) return members
    return [...members].filter((member) => (
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
            <h4 className='m-3'>{members.length} membres</h4>
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
              </tr>
            </thead>
            <tbody>
              {
                filteredMember.sort((a, b) => {
                  if (sortByDate === true) {
                    return a.acceptedDate - b.acceptedDate
                  }
                  else if (sortByDate === false) {
                    return b.acceptedDate - a.acceptedDate
                  }
                  else if (sortByName === true) {
                    return a.fname.localeCompare(b.fname, 'fr')
                  }
                  else {
                    return b.fname.localeCompare(a.fname, 'fr')
                  }
                }).map((member, index) => (
                  <tr key={member._id}
                    onClick={() => {
                      navigate(`/admin/membre/${member._id}`)
                      ToogleOppened(member._id)
                    }}
                    className="cursor-pointer hover:bg-gray-100 transition border">
                    <th scope="row" className='p-2'>{index + 1}</th>
                    <td className='p-2'>
                      {member.fname} {member.lname}
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