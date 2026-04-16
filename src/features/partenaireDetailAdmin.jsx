import { useEffect, useState } from 'react'
import axios from 'axios'
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import { Link, useNavigate, useParams } from 'react-router'
import Loading from '../components/LoadingPage'
import Page404 from '../pages/404'

const AdminDetailPartner = () => {
  const [partner, setPartner] = useState()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const dataFect = async () => {
      try {
        setLoading(true)
        const snapDoc = await getDoc(doc(db, 'partner', id))
        if (snapDoc.exists()) {
          setPartner({ _id: snapDoc.id, ...snapDoc.data() })
        } else {
          setPartner(null)
        }
      } catch (error) {
        setPartner(null)
      } finally {
        setLoading(false)
      }
    };
    dataFect()
  }, [])

  const ToogleDisplay = () => {
    updateDoc(doc(db, 'partner', partner._id), { displayed: !partner.displayed })
    setPartner({ ...partner, displayed: !partner.displayed })
  }

  const DeletePartner = async (partnerId) => {
    try {
      await deleteDoc(doc(db, 'partner', partnerId)).then(() => navigate('/admin/partenaire'))
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) return <Loading></Loading>
  if (!partner) return <Page404 message={'Partenaire non trouvé'} prev={'Revenir aux partenaire'} prevLink={'/admin/partenaire'} />


  return (
    <div class="page">
      <div className='m-2 p-2 rounded-md border-1 border-gray-400 bg-gray-100 -w-[300px] flex flex-col justify-center itmes-center'>
        <div className='flex justify-between border-b p-2 border-gray-400'>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" checked={partner.displayed} onChange={ToogleDisplay} />
            <label class="form-check-label" for="switchCheckDefault">Afficher</label>
          </div>
          <button className='btn btn-danger' onClick={() => DeletePartner(partner._id)}><i className='fa-solid fa-trash'></i></button>
        </div>
        <div className=' p-3'>
          <img src={partner.image} alt="" className='h-[200px] max-w-[200px] object-contain border rounded bg-white' />
          <p className='p-2'>{partner.name}</p>
          <p className='p-2'>{partner.datePartner}</p>
        </div>
      </div>
    </div>
  )
}


export default AdminDetailPartner