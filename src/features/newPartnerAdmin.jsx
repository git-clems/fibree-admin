import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'


const AdminNewPartners = () => {
  const [newPartners, setNewPartners] = useState()
  const [sortByDate, setSortByDate] = useState(false)
  const [sortByName, setSortByName] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  // const

  useEffect(() => {
    const fectData = async () => {
      try {

        onSnapshot(collection(db, 'new-partner'), snap => {
          const data = snap.docs.map((doc) => ({
            _id: doc.id,
            ...doc.data()
          }))
          setNewPartners(data.filter(e => !e.accepted))
        }
        )
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const ToogleOppened = async (newPartnerId) => {
    try {
      setNewPartners((prev) =>
        prev.map(newPartner => (
          newPartner._id === newPartnerId ? { ...newPartner, opened: true } : newPartner
        ))
      )
      await updateDoc(doc(db, 'new-partner', newPartnerId), { opened: true })

    } catch (error) {
      console.log(error);
    }
  }

  const normalizedSearch = search.trim().toLowerCase()

  const filteredNewPartner = useMemo(() => {
    if (!normalizedSearch) return newPartners
    return [...newPartners].filter((newPartner) => (
      `${newPartner.name}`.toLowerCase().includes(normalizedSearch)
    ))
  })

  while (!newPartners) {
    return <Loading></Loading>
  }

  return (
    <div className='page'>
      {
        <div className='mb-5'>
          <div className='flex flex-wrap items-center justify-between '>
            <h4 className='m-3'>{newPartners.filter(e => !e.accepted).length === 0 && "Acune demande de partenariat en attente" } {newPartners.filter(e => !e.accepted).length === 1 && "Une demande de partenariat en attente"} {newPartners.filter(e => !e.accepted).length > 1 && <span>{newPartners.filter(e => !e.accepted).length} demandes de partenariat en attente</span>}</h4>
            <form className="flex flex-1 flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 min-[800px]:m-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex w-full border-2 border-gray-300 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-blue-300 focus-within:border-white duration-50">
                <input type="search" placeholder="Rechercher une demande" value={search} onChange={(e) => setSearch(e.target.value)} className="border-l-none outline-none rounded-l-full h-[40px] pl-2 flex-1" />
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
                }}>Nom {sortByName === true && <i class="fa-solid fa-sort-down"></i>}{sortByName === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
                <th scope="col" className="p-2 text-end">
                  <button onClick={() => {
                    setSortByName(null)
                    sortByDate === null ?
                      setSortByDate(false) :
                      setSortByDate(!sortByDate)
                  }}>Demandé le {sortByDate === true && <i class="fa-solid fa-sort-down"></i>}{sortByDate === false && <i class="fa-solid fa-sort-up"></i>}</button>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                filteredNewPartner.sort((a, b) => {
                  if (sortByDate === true) {
                    return a.newPartnerDate - b.newPartnerDate
                  }
                  else if (sortByDate === false) {
                    return b.newPartnerDate - a.newPartnerDate
                  }
                  else if (sortByName === true) {
                    return a.name.localeCompare(b.name, 'fr')
                  }
                  else {
                    return b.name.localeCompare(a.name, 'fr')
                  }
                }).filter(e => !e.accepted).map((newPartner, index) => (
                  <tr key={newPartner._id}
                    onClick={() => {
                      navigate(`/admin/nouveau-partenaire/${newPartner._id}`)
                      ToogleOppened(newPartner._id)
                    }}
                    className={`cursor-pointer hover:bg-gray-100 transition border ${newPartner.opened && 'bg-sky-50'}`}
                  >
                    <th scope="row" className='p-2'>{index + 1}</th>
                    <td className='p-2'>
                      {newPartner.name.toUpperCase()}
                    </td>
                    <td className='p-2 text-end'>
                      {newPartner.sendDate?.toDate().toLocaleString('fr-FR')}
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

export default AdminNewPartners