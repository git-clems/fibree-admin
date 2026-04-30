import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddInfo from '../Controllers/info/addInfo'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'
import UpdateInfo from '../Controllers/info/updateInfo'


const AdminInfos = () => {
  const [infos, setInfos] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = onSnapshot(collection(db, 'infos'), snap => {
      const data = snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))
      setInfos(data.filter(e => !e.removed))
    })
    return () => fetchData
  }, [])

  const deleteInfo = async (infoId) => {
    await updateDoc(doc(db, 'infos', infoId), { removed: true }).catch((error) => console.log(error)
    )
  }

  const toggleDisplay = async (infoId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await updateDoc(doc(db, 'infos', infoId), {
        displayed: updatedValue,
      });

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
      <div className='flex flex-wrap'>
        {
          !infos?.length
            ? <div className='flex justify-center items-center w-full h-[80vh]'>Aucune actualité enrégistrée</div> :
            infos.map(info => (
              <div key={info._id} className='border duration-100 m-1 rounded w-[300px] max-[600px]:w-full bg-white flex flex-col'>
                <img src={info.image || "/bg/info-bg.jpg"} alt="" className={`h-[200px] rounded-t-md object-cover`} />
                <div className='p-2 border-t border-gray-200 max-h-50 overflow-hidden h-[max-content]'>
                  <div className='flex justify-between items-center mt-2 mb-2'>
                    <button className='btn btn-danger' onClick={(e) => {
                      e.stopPropagation()
                      deleteInfo(info._id)
                    }}>
                      <i className='fa-solid fa-trash'></i>
                    </button>

                    <div class="form-check form-switch">
                      <input class="form-check-input cursor-pointer" type="checkbox" role="switch" id="switchCheckDefault"
                        onChange={() => {
                          toggleDisplay(info._id, info.displayed)
                        }}
                        checked={info.displayed} />
                    </div>
                    <UpdateInfo infoId={info._id}></UpdateInfo>
                  </div>
                  <div className='line-clamp-3'>{info.title}</div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default AdminInfos