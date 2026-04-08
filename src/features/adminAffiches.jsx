import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import AddAffiche from '../ux/addAffiche'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'


const AdminAffiches = () => {
  const [flashAffiches, setAffiches] = useState()

  useEffect(() => {
    const fectData = async () => {
      try {
        const response = await getDocs(collection(db, 'carrousel-affiche'))
        const data = response.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data()
        }))
        setAffiches(data)
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const deleteAffiches = async (flashAfficheId) => {
    await axios.delete(`http://localhost:8000/api/flash/${flashAfficheId}`)
      // .then((res) => {
      //   navigate('/flashAffiche')
      // })
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (flashAfficheId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await axios.put(`http://localhost:8000/api/flash/update/${flashAfficheId}`, {
        displayed: updatedValue,
      });

      // Mise à jour du state (UI instantanée)
      setAffiches((prevAffiches) =>
        prevAffiches.map((flashAffiche) =>
          flashAffiche._id === flashAfficheId ?
            { ...flashAffiche, displayed: updatedValue }
            : flashAffiche
        ));
    } catch (error) {
      console.log(error);
    }
  };

  while (!flashAffiches) {
    return <Loading></Loading>
  }


  return (
    <div className='page'>
      {
        !flashAffiches || flashAffiches.length === 0 ?
          <>
            <h1 className='ml-3'>Aucune affiche disponible</h1>
            <AddAffiche></AddAffiche>
          </> :
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
                {flashAffiches.map((flashAffiche, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <h6>{flashAffiche.title}</h6>
                      <p className='text-gray-500 truncate max-w-[60vw]'>{flashAffiche.subtitle}</p>
                    </td>
                    <td>
                      <input type="checkbox" className="m-2"
                        checked={flashAffiche.displayed}
                        onChange={() => toggleDisplay(flashAffiche._id, flashAffiche.displayed)} />
                    </td>
                    <td>
                      <Link style={{ borderRadius: 5 }} to={`/admin/actualite/${flashAffiche._id}`} className="m-2 h-[40px] w-[40px] p-2 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
                        <i class="fa-solid fa-pencil"></i>
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => deleteAffiches(flashAffiche._id)} className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
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