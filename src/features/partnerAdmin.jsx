import { useEffect, useMemo, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import { Link } from 'react-router'
import Loading from '../components/LoadingPage'
import AddPartenaire from '../Controllers/partner/addPartner'
import Page404 from '../pages/404'
import UpdatePartner from '../Controllers/partner/updatePatner'

const AdminPartners = () => {
  const [partners, setPartners] = useState()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const fetchData = onSnapshot(collection(db, 'partner'), snap => {
      if (snap) {
        const data = snap.docs.map(doc => ({
          _id: doc.id,
          ...doc.data()
        }))
        setPartners(data.filter(e => !e.removed))
      } else {
        setPartners(null)
        setLoading(false)
      }
      setLoading(false)
    })
    return () => fetchData
  }, [])



  const deleteAddPartner = async (partnerId) => {
    await updateDoc(doc(db, 'partner', partnerId), { removed: true })
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (partnerId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await updateDoc(doc(db, 'partner', partnerId), {
        displayed: updatedValue,
      });

    } catch (error) {
      console.log(error);
    }
  };

  const partner = search.trim().toLowerCase()
  const searchedPartner = useMemo(() => {
    if (!partner) return partners
    return [...partners].filter(e => e.name.trim().toLowerCase().includes(partner))
  })

  if (loading) return <Loading></Loading>
  if (!partners) return <Page404 prev={"Rafraichir la page"} prevLink={'/admin/partenaire'}></Page404>

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

        <div className='flex flex-wrap m-1 bg-white'>
          {!partners?.length
            ? <div className='flex justify-center items-center w-full h-[80vh]'>Aucun partenaire enregistré</div>
            : searchedPartner.map((partner) => (
              <div key={partner._id} to={`/admin/partenaire/${partner._id}`} className='bg-white  w-[250px] max-[600px]:w-[100%]  m-1 border-1 border-gray-200 duration-100 justify-center flex flex-col shadow-[0_0_5px_rgba(0,0,0,0.2)] rounded-md'>
                <img src={partner.image} alt="" className='h-[200px] object-contain' />
                <div className='flex justify-between items-center w-full mt-2 mb-0 p-2 pb-0 border-t border-gray-200'>
                  <button className='btn btn-danger'
                    onClick={() => { deleteAddPartner(partner._id) }}>
                    <i className='fa-solid fa-trash'></i>
                  </button>

                  <div class="form-check form-switch">
                    <input class="form-check-input cursor-pointer" type="checkbox" role="switch" id="switchCheckDefault"
                      onChange={() => { toggleDisplay(partner._id, partner.displayed) }}
                      checked={partner.displayed} />
                  </div>

                  <UpdatePartner partnerId={partner._id}></UpdatePartner>

                </div>
                <p className='p-2 pt-0 pb-0 line-clamp-2'>{partner.name}</p>

              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}


export default AdminPartners