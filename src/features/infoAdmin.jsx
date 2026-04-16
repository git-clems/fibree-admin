import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddInfo from '../ux/addInfo'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'


const AdminInfos = () => {
  const [infos, setInfos] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = onSnapshot(collection(db, 'infos'), snap => setInfos(
      snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))
    ))
    return () => fetchData
  }, [])

  const deleteInfo = async (infoId) => {
    await deleteDoc(doc(db, 'infos', infoId))
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (infoId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await updateDoc(doc(db, 'infos', infoId), {
        displayed: updatedValue,
      });

      // Mise à jour du state (UI instantanée)
      setInfos((prevInfos) =>
        prevInfos.map((info) =>
          info._id === infoId ?
            { ...info, displayed: updatedValue }
            : info
        ));
    } catch (error) {
      console.log(error);
    }
  };

  while (!infos) {
    return <Loading></Loading>
  }


  return (
    <div className='page'>
      <AddInfo></AddInfo>
      <div className='flex justify-center flex-wrap'>
        {
          infos.map(info => (
            <div key={info._id} to={`/actualite/${info._id}`} className='border  duration-100 m-1 rounded w-[300px] max-[600px]:w-full bg-white flex flex-col'>
              {
                info.images.length > 0 ?
                  <img src={info.images[0]} alt="" className={`h-[200px] bg-black rounded-t-md object-contain duration-100 p-2`} /> :
                  <img src={"/bg/info-bg.jpg"} alt="" className='h-[200px] rounded-t-md object-contain' />
              }
              <div className='p-2 border-t border-gray-200'>
                <div className='flex justify-between items-center mt-2 mb-2'>
                  <button className='btn btn-danger' onClick={(e) => {
                    e.stopPropagation()
                    deleteInfo(info._id)
                  }}>
                    <i className='fa-solid fa-trash'></i>
                  </button>

                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" onChange={() => {
                      toggleDisplay(info._id, info.displayed)
                    }}
                      checked={info.displayed} />
                  </div>

                  <button className='btn btn-primary' onClick={() => {
                    navigate(`/actualite/${info._id}`)
                  }}>
                    Voir
                  </button>

                </div>
                <div className='truncate'>{info.title}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AdminInfos