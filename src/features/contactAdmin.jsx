import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'
import Page404 from '../pages/404'
import { PublishTime } from './admin'
// import { formatDay } from './admin'



const AdminContacts = () => {
  const [contacts, setContacts] = useState()
  const [sortByDate, setSortByDate] = useState(false)
  const [sortByName, setSortByName] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fectData = async () => {
      try {
        onSnapshot(collection(db, 'contact'), snap => {
          const data = snap.docs.map((doc) => ({
            _id: doc.id,
            ...doc.data()
          }))
          setContacts(data.filter(e => !e.removed))
        })
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const deleteContact = async (contactId) => {
    setDeleting(true)
    try {
      await updateDoc(doc(db, 'contact', contactId), { removed: true })
    } catch (error) {
      return <Page404 message={'Une erreur est survenue'}></Page404>
    } finally {
      setDeleting(false)
    }
  }

  const ToogleOppened = async (contactId) => {
    try {
      await updateDoc(doc(db, 'contact', contactId), { opened: true })

    } catch (error) {
      console.log(error);
    }
  }


  const normalizedSearch = search.trim().toLowerCase()

  const filteredContact = useMemo(() => {
    if (!normalizedSearch) return contacts
    return [...contacts].filter((contact) => (
      `${contact.fname} ${contact.lname}`.toLowerCase().includes(normalizedSearch)
    ))
  })

  while (!contacts) {
    return <Loading></Loading>
  }

  return (
    <div className='page'>
      {
        <div className='mb-5'>
          <div className='flex flex-wrap items-center justify-between '>
            {contacts.filter(e => !e.opened).length > 0 &&
              <span className='m-3'>
                {
                  contacts.filter(e => !e.opened).length > 1 ? `${contacts.filter(e => !e.opened).length} messages non lus` :
                    "1 message non lu"
                }
              </span>
            }
            <form className="flex flex-1 flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 min-[800px]:m-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex w-full border-2 border-gray-300 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-blue-300 focus-within:border-white duration-50">
                <input type="search" placeholder="Rechercher un nom" value={search} onChange={(e) => setSearch(e.target.value)} className="border-l-none outline-none rounded-l-full h-[40px] pl-2 flex-1" />
                <div className="text-gray-400 pr-5 pl-5 border-gray-300 flex justify-center items-center"><i class="fa-solid fa-magnifying-glass"></i></div>
              </div>
            </form>
          </div>

          <table class="flex-1 w-full text-sm">
            <thead className='bg-gray-600 text-white'>
              <tr className='w-full'>
                <th scope="col" className="p-2">#</th>
                <th scope="col" className="p-2"><button onClick={() => {
                  setSortByDate(null)
                  sortByName === null ?
                    setSortByName(false) :
                    setSortByName(!sortByName)
                }}>Expéditeur {sortByName === true && <i class="fa-solid fa-sort-down"></i>}{sortByName === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
                <th className='max-[600px]:hidden'>Objet</th>
                <th scope="col" className="p-2">
                  <button onClick={() => {
                    setSortByName(null)
                    sortByDate === null ?
                      setSortByDate(false) :
                      setSortByDate(!sortByDate)
                  }}>Reçu {sortByDate === true && <i class="fa-solid fa-sort-down"></i>}{sortByDate === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
                <th></th>
              </tr>
            </thead>
            {
              !contacts?.length
                ? <div className='flex justify-center items-center w-full h-[80vh]'>Aucun message</div>
                : <tbody>
                  {
                    filteredContact.sort((a, b) => {
                      if (sortByDate === true) {
                        return a.contactDate - b.contactDate
                      }
                      else if (sortByDate === false) {
                        return b.contactDate - a.contactDate
                      }
                      else if (sortByName === true) {
                        return a.lname.localeCompare(b.lname, 'fr')
                      }
                      else {
                        return b.lname.localeCompare(a.lname, 'fr')
                      }
                    }).map((contact, index) => (
                      <tr key={contact._id}
                        onClick={() => {
                          navigate(`/admin/messagerie/${contact._id}`)
                          ToogleOppened(contact._id)
                        }}

                        // className={`cursor-pointer hover:bg-blue-100 transition border ${contact.opened && 'font-bold'}`}
                        className={`cursor-pointer hover:bg-yellow-50 transition border ${contact.opened && 'bg-gray-100'}`}
                      >
                        <th scope="row" className='p-2'>{index + 1}</th>
                        <td className='p-2 bg-red-00'>
                          <div className='truncate w-[150px]'>
                            <span>{contact.lname.toUpperCase()} {contact.fname}</span> <br />
                            <span className='text-gray-400 min-[600px]:hidden'>{contact.object}</span>
                          </div>
                        </td>
                        <td className='max-[600px]:hidden'><div className='truncate max-w-[50vw]'>{contact.object}</div></td>
                        <td className='p-2'>
                          {PublishTime(contact.contactDate)}
                        </td>
                        <td>
                          <button onClick={(e) => {
                            e.stopPropagation()
                            deleteContact(contact._id)
                          }} className="m-2 h-[22px] w-[22px] max-[600px]:h-[35px] max-[600px]:w-[35px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
                            <i class="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
            }
          </table>
        </div>
      }
    </div>
  )
}

export default AdminContacts