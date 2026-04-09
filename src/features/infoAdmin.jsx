import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddInfo from '../ux/addInfo'
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../auth/firebase';
import Loading from '../components/LoadingPage';



const AdminInfos = () => {
  const [infos, setInfos] = useState()
  const [sortByDate, setSortByDate] = useState(false)
  const [sortByName, setSortByName] = useState(false)

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
    await deleteDoc(doc(db, 'infos', infoId)).catch((err) => {
      console.log(err);
    })
  }

  const toggleDisplay = async (infoId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await updateDoc(doc(db, 'infos', infoId), {
        displayed: updatedValue,
      });
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
        infos.length === 0 ?
          <>
            <div className='ml-3'><span className='text-red-500'>Aucune information disponible</span></div>
            <AddInfo></AddInfo>
            <table className='table'>
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
            </table>
          </>
          :
          <>
            <AddInfo></AddInfo>
            {<table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Titre</th>
                  <th scope="col"><button onClick={() => setSortByDate(!sortByDate)}>Date de publication {sortByDate ? <i class="fa-solid fa-sort-down"></i> : <i class="fa-solid fa-sort-up"></i>}</button></th>
                  <th scope="col">Afficher</th>
                  <th scope="col">Editer</th>
                  <th scope="col">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {
                  infos.sort((a, b) => (sortByDate ? a.publishDate - b.publishDate : b.publishDate - a.publishDate )).map((info, index) => (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <p className='truncate max-w-[60vw]'>{info.title}</p>
                        <p className='text-gray-500 truncate max-w-[60vw]'>{info.subtitle}</p>
                      </td>
                      <td>
                        <span className='text-gray-500'>{info.publishDate?.toDate().toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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