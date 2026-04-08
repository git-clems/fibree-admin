import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddFlashInfo from '../ux/addFlashInfo'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'


const AdminFlashInfos = () => {
  const [flashInfos, setFlashInfos] = useState()

  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await getDocs(collection(db, 'flash-info'))
        const data = response.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data()
        }))
        setFlashInfos(data)
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const deleteFlashInfos = async (flashInfoId) => {
    await axios.delete(`http://localhost:8000/api/flash/${flashInfoId}`)
      .then((res) => {
        navigate('/flashInfo')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (flashInfoId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await axios.put(`http://localhost:8000/api/flash/update/${flashInfoId}`, {
        displayed: updatedValue,
      });

      // Mise à jour du state (UI instantanée)
      setFlashInfos((prevFlashInfos) =>
        prevFlashInfos.map((flashInfo) =>
          flashInfo._id === flashInfoId ?
            { ...flashInfo, displayed: updatedValue }
            : flashInfo
        ));
    } catch (error) {
      console.log(error);
    }
  };

  while (!flashInfos) {
    return <Loading></Loading>
  }


  return (
    <div className='page'>
      {
        !flashInfos || flashInfos.length === 0 ?
          <>
            <h1 className='ml-3'>Aucune info disponible</h1>
            <AddFlashInfo></AddFlashInfo>
          </> :
          <>
            {/* <h1 className='ml-3'>Les infos flash</h1> */}
            <AddFlashInfo></AddFlashInfo>
            {<table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Titre</th>
                  <th scope="col">Afficher</th>
                  <th scope="col">Editer</th>
                  <th scope="col">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {flashInfos.map((flashInfo, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <h6>{flashInfo.title}</h6>
                      <p className='text-gray-500 truncate max-w-[60vw]'>{flashInfo.subtitle}</p>
                    </td>
                    <td>
                      <input type="checkbox" className="m-2"
                        checked={flashInfo.displayed}
                        onChange={() => toggleDisplay(flashInfo._id, flashInfo.displayed)} />
                    </td>
                    <td>
                      <Link style={{ borderRadius: 5 }} to={`/admin/actualite/${flashInfo._id}`} className="m-2 h-[40px] w-[40px] p-2 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
                        <i class="fa-solid fa-pencil"></i>
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => deleteFlashInfos(flashInfo._id)} className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>}
          </>
      }
    </div>
  )
}

export default AdminFlashInfos