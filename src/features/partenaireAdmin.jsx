import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../auth/firebase'
import { Link } from 'react-router'
import Loading from '../components/LoadingPage'
import AddPartenaire from '../ux/addPartenaire'

const AdminPartenaires = () => {
  const [partenaires, setPartenaires] = useState()
  const [search, setSearch] = useState('')


  useEffect(() => {
    const fetchData = onSnapshot(collection(db, 'partner'), snap => {
      const data = snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))
      setPartenaires(data)
    })
    return () => fetchData
  }, [])

  const partner = search.trim().toLowerCase()
  const searchedPartner = useMemo(() => {
    if (!partner) return partenaires
    return [...partenaires].filter(e => e.name.trim().toLowerCase().includes(partner))
  })

  while (!partenaires) {
    return <Loading></Loading>
  }

  return (
    <div class="page ">
      <AddPartenaire></AddPartenaire>
      <div className=''>
        <form className="flex flex-1  flex-wrap max-w-[1000px] items-center justify-center max-[800px]:m-2 min-[800px]:m-5" onSubmit={(e) => e.preventDefault()}>
          <div className="flex w-full border-2 border-gray-300 rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-blue-300 focus-within:border-white duration-50">
            <input type="search" placeholder="Rechercher un partenaire" value={search}
              onChange={(e) => {
                e.preventDefault()
                setSearch(e.target.value)
              }} className="border-l-none outline-none rounded-l-full h-[40px] pl-2 flex-1" />
            <div className="text-gray-400 pr-5 pl-5 border-gray-300 flex justify-center items-center"><i class="fa-solid fa-magnifying-glass"></i></div>
          </div>
        </form>

        <div className='flex flex-wrap m-1'>
          {
            searchedPartner.map((partenaire) =>
            (<Link to={`/admin/partenaire/${partenaire._id}`} className='bg-white  w-[250px] max-[600px]:w-[100%]  m-1 border-1 border-gray-200 duration-100 justify-center flex flex-col hover:scale-110 hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]  shadow-[0_0_5px_rgba(0,0,0,0.2)]  rounded-md'>
              <img src={partenaire.image} alt="" className='h-[200px] object-contain' />
              <p className='p-2 '>{partenaire.name}</p>
            </Link>))
          }
        </div>
      </div>
    </div>
  )
}


export default AdminPartenaires