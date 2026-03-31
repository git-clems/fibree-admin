import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddAffiche from '../ux/addAffiche'


const AdminAffiches = () => {
  const [affiches, setAffiches] = useState([])

  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/affiche')
        setAffiches(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const deleteAffiches = async (afficheId) => {
    await axios.delete(`http://localhost:8000/api/affiche/${afficheId}`)
      .then((res) => {
        navigate('/affiche')
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (afficheId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await axios.put(`http://localhost:8000/api/affiche/update/${afficheId}`, {
        displayed: updatedValue,
      });

      // Mise à jour du state (UI instantanée)
      setAffiches((prevAffiches) =>
        prevAffiches.map((affiche) =>
          affiche._id === afficheId ?
            { ...affiche, displayed: updatedValue }
            : affiche
        ));
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className='page'>
      {
        !affiches ? <h1>Aucune affichermation disponible</h1> :
          <>
            <AddAffiche></AddAffiche>
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
                {affiches.map((affiche, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <h6>{affiche.title}</h6>
                      <p className='text-gray-500 truncate max-w-[60vw]'>{affiche.subtitle}</p>
                    </td>
                    <td>
                      <input type="checkbox" className="m-2"
                        checked={affiche.displayed}
                        onChange={() => toggleDisplay(affiche._id, affiche.displayed)} />
                    </td>
                    <td>
                      <Link style={{ borderRadius: 5 }} to={`/admin/affiche/${affiche._id}`} className="m-2 h-[40px] w-[40px] p-2 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
                        <i class="fa-solid fa-pencil"></i>
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => deleteAffiches(affiche._id)} className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
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

export default AdminAffiches