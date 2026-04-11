import { useEffect, useState } from 'react'
import axios from 'axios'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import { Link, useNavigate, useParams } from 'react-router'
import Loading from '../components/LoadingPage'

const AdminDetailPartner = () => {
  const [partenaire, setPartenaire] = useState()
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const dataFect = async () => {
      try {
        const response = await getDocs(collection(db, 'partner'))
        const data = response.docs.map((e) => ({
          _id: e.id,
          ...e.data()
        }))
        setPartenaire(data.find(e => e._id === id))
      } catch (error) {
        console.log(error);
      }
    };
    dataFect()
  }, [])

  const ToogleDisplay = () => {
    updateDoc(doc(db, 'partner', partenaire._id), { displayed: !partenaire.displayed })
    setPartenaire({ ...partenaire, displayed: !partenaire.displayed })
  }

  const DeletePartner = async (partnerId) => {
    try {
      await deleteDoc(doc(db, 'partner', partnerId)).then(() => navigate('/admin/partenaire'))
    } catch (error) {
      console.log(error);
    }
  }

  if (!partenaire) {
    return <Loading></Loading>
  }


  return (
    <div class="page">
      <div className='m-2 p-2 rounded-md border-1 border-gray-400 bg-gray-100 -w-[300px] flex flex-col justify-center itmes-center'>
        <div className='flex justify-between border-b p-2 border-gray-400'>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" checked={partenaire.displayed} onChange={ToogleDisplay} />
            <label class="form-check-label" for="switchCheckDefault">Afficher</label>
          </div>
          <button className='btn btn-danger' onClick={() => DeletePartner(partenaire._id)}><i className='fa-solid fa-trash'></i></button>
        </div>
        <div className='flex p-3'>
          <img src={partenaire.image} alt="" className='h-[200px] max-w-[200px] object-contain rounded-md' />
          <p className='p-2'>{partenaire.name}</p>
          <p className='p-2'>{partenaire.datePartner}</p>
        </div>
      </div>
    </div>
  )
}


export default AdminDetailPartner