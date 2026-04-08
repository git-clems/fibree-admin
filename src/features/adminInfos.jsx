import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddInfo from '../ux/addInfo'
import { collection, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../auth/firebase';
import Loading from '../components/LoadingPage';


export const formatDate = (date) => {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

const AdminInfos = () => {
  const [infos, setInfos] = useState()

  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await getDocs(collection(db, 'infos'))
        const data = response.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data()
        }))
        setInfos(data)
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const deleteInfos = async (infoId) => {
    await deleteDoc(collection(db,'infos'))
  }

  const toggleDisplay = async (infoId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await axios.put(`http://localhost:8000/api/info/update/${infoId}`, {
        displayed: updatedValue,
      });
      // await updateDoc(collection(db, `infos/${infoId}`), { displayed: updatedValue })

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
      {
        !infos ? <h1>Aucune information disponible</h1> :
          <>
            <AddInfo></AddInfo>
            {<table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Titre</th>
                  <th scope="col">Date de création</th>
                  <th scope="col">Afficher</th>
                  <th scope="col">Editer</th>
                  <th scope="col">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {infos.map((info, index) => (
                  <tr>
                    {/* <Link to={`/actualite/${info._id}`}> */}
                    <th scope="row">{index + 1}</th>
                    <td>
                      <p className='truncate max-w-[60vw]'>{info.title}</p>
                      <p className='text-gray-500 truncate max-w-[60vw]'>{info.subtitle}</p>
                    </td>
                    <td>
                      <span className='text-gray-500'>{formatDate(info.publishDate)}</span>
                    </td>
                    <td>
                      <input type="checkbox" className="m-2"
                        checked={info.displayed}
                        onChange={() => toggleDisplay(info._id, info.displayed)} />
                    </td>
                    <td>
                      <Link style={{ borderRadius: 5 }} to={`/actualite/${info._id}`} className="m-2 h-[40px] w-[40px] p-2 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
                        <i class="fa-solid fa-pencil"></i>
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => deleteInfos(info._id)} className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </td>
                    {/* </Link> */}
                  </tr>
                ))}
              </tbody>
            </table>}
          </>
      }
    </div>
  )
}

export default AdminInfos