import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddPartenaire from '../ux/addPartenaire'


const AdminPartenaires = () => {
  const [partenaires, setPartenaires] = useState([])

  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/partenaire')
        setPartenaires(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const deletePartenaires = async (partenaireId) => {
    await axios.delete(`http://localhost:8000/api/partenaire/${partenaireId}`)
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (partenaireId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await axios.put(`http://localhost:8000/api/partenaire/update/${partenaireId}`, {
        displayed: updatedValue,
      });

      // Mise à jour du state (UI instantanée)
      setPartenaires((prevPartenaires) =>
        prevPartenaires.map((partenaire) =>
          partenaire._id === partenaireId ?
            { ...partenaire, displayed: updatedValue }
            : partenaire
        ));
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className='page'>
      {
        !partenaires ? <h1>Aucun partenaire disponible</h1> :
          <>
            <AddPartenaire></AddPartenaire>
            {<table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Afficher</th>
                  <th scope="col">Editer</th>
                  <th scope="col">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {partenaires.reverse().map((partenaire, index) => (
                  <tr>
                    <th scope="row" className='bg-red-200'>{index + 1}</th>
                    <td>{partenaire.name}</td>
                    <td>
                      <input type="checkbox" className="m-2"
                        checked={partenaire.displayed}
                        onChange={() => toggleDisplay(partenaire._id, partenaire.displayed)} />
                    </td>
                    <td>
                      <Link style={{ borderRadius: 5 }} to={`/admin/partenaire/${partenaire._id}`} className="m-2 h-[40px] w-[40px] p-2 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
                        <i class="fa-solid fa-pencil"></i>
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => deletePartenaires(partenaire._id)} className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
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

export default AdminPartenaires