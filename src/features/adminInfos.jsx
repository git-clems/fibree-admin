import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddInfo from '../ux/addInfo'


const AdminInfos = () => {
  const [infos, setInfos] = useState([])

  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/info')
        setInfos(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const deleteInfos = async (infoId) => {
    await axios.delete(`http://localhost:8000/api/info/${infoId}`)
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (infoId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await axios.put(`http://localhost:8000/api/info/update/${infoId}`, {
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
                    <th scope="row">{index + 1}</th>
                    <td>
                      <h6>{info.title}</h6>
                      <p className='text-gray-500 truncate max-w-[60vw]'>{info.subtitle}</p>
                    </td>
                    <td>
                      <span>{info.publishDate}</span>
                    </td>
                    <td>
                      <input type="checkbox" className="m-2"
                        checked={info.displayed}
                        onChange={() => toggleDisplay(info._id, info.displayed)} />
                    </td>
                    <td>
                      <Link style={{ borderRadius: 5 }} to={`/admin/actualite/${info._id}`} className="m-2 h-[40px] w-[40px] p-2 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
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