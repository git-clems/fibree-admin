import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'


const AdminContacts = () => {
  const [contacts, setContacts] = useState()
  const [sortByDate, setSortByDate] = useState(false)
  const [sortByName, setSortByName] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  // const

  useEffect(() => {
    const fectData = async () => {
      try {
        onSnapshot(collection(db, 'contact'), snap => (
          setContacts(snap.docs.map((doc) => ({
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

  const deleteContact = async (contactId) => {
    await deleteDoc(doc(db, 'contact', contactId))
  }

  const ToogleOppened = async (contactId) => {
    try {
      setContacts((prev) =>
        prev.map(contact => (
          contact._id === contactId ? { ...contact, opened: true } : contact
        ))
      )
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
            <span className='m-3'>{contacts.filter(e => !e.opened).length} messages non lues</span>
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
                }}>Expéditeur {sortByName === true && <i class="fa-solid fa-sort-down"></i>}{sortByName === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
                <th className='max-[800px]:hidden'>Objet</th>
                <th scope="col" className="p-2">
                  <button onClick={() => {
                    setSortByName(null)
                    sortByDate === null ?
                      setSortByDate(false) :
                      setSortByDate(!sortByDate)
                  }}>Date {sortByDate === true && <i class="fa-solid fa-sort-down"></i>}{sortByDate === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredContact.sort((a, b) => {
                  if (sortByDate === true) {
                    return a.contactDate - b.contactDate
                  }
                  else if (sortByDate === false) {
                    return b.contactDate - a.contactDate
                  }
                  else if (sortByName === true) {
                    return a.fname.localeCompare(b.fname, 'fr')
                  }
                  else {
                    return b.fname.localeCompare(a.fname, 'fr')
                  }
                }).map((contact, index) => (
                  <tr key={contact._id}
                    onClick={() => {
                      navigate(`/admin/messagerie/${contact._id}`)
                      ToogleOppened(contact._id)
                    }}
                    
                    className={`cursor-pointer hover:bg-gray-100 transition border ${contact.opened && 'bg-sky-50'}`}
                  >
                    <th scope="row" className='p-2'>{index + 1}</th>
                    <td className='p-2 bg-red-00'>
                      <div className='truncate w-[150px]'>
                        <span>{contact.lname.toUpperCase()} {contact.fname}</span> <br />
                        <span className='text-gray-400 min-[800px]:hidden'>{contact.object}</span>
                      </div>
                    </td>
                    <td className='max-[800px]:hidden'><div className='truncate max-w-[50vw]'>{contact.object}</div></td>
                    <td className='p-2'>
                      {contact.contactDate?.toDate().toLocaleString('fr-FR')}
                    </td>
                    <td>
                      <button onClick={(e) => {
                        e.stopPropagation()
                        deleteContact(contact._id)
                      }} className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
                        <i class="fa-solid fa-trash"></i>
                      </button>
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

export default AdminContacts