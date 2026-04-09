import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { data, Link } from 'react-router-dom'
import AddAffiche from '../ux/addAffiche'
import { collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'


const AdminAffiches = () => {
  const [Affiches, setAffiches] = useState()

  useEffect(() => {
    const fectData = async () => {
      try {
        // const response = await getDocs(collection(db, 'carrousel-affiche'))
        // const data = response.docs.map((doc) => ({
        //   _id: doc.id,
        //   ...doc.data()
        // }))
        // setAffiches(data)
        onSnapshot(collection(db, 'carrousel-affiche'), snap => {
          setAffiches(
            snap.docs.map((doc) => ({
              _id: doc.id,
              ...doc.data()
            }))
          )
        }
        )
      } catch (error) {
        console.log(error);
      }
    };
    fectData();
  }, [])

  const deleteAffiches = async (afficheId) => {
    await deleteDoc(doc(db, 'carrousel-affiche', afficheId))
      // .then((res) => {
      //   navigate('/Affiche')
      // })
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (afficheId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await updateDoc(doc(db, 'carrousel-affiche', afficheId), { displayed: updatedValue })

      setAffiches((prevAffiches) =>
        prevAffiches.map((Affiche) =>
          Affiche._id === afficheId ?
            { ...Affiche, displayed: updatedValue }
            : Affiche
        ));
    } catch (error) {
      console.log(error);
    }
  };

  while (!Affiches) {
    return <Loading></Loading>
  }


  return (
    <div className='page'>
      {
        !Affiches || Affiches.length === 0 ?
          <>
            <h1 className='ml-3'>Aucune affiche disponible</h1>
            <AddAffiche></AddAffiche>
          </> :
          <>
            <AddAffiche></AddAffiche>
            {<table class="table text-sm">
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
                {Affiches.map((Affiche, index) => (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <h6>{Affiche.title}</h6>
                      <p className='text-gray-500 truncate max-w-[60vw]'>{Affiche.subtitle}</p>
                    </td>
                    <td>
                      <input type="checkbox" className="m-2"
                        checked={Affiche.displayed}
                        onChange={() => toggleDisplay(Affiche._id, Affiche.displayed)} />
                    </td>
                    <td>
                      <Link style={{ borderRadius: 5 }} to={`/admin/actualite/${Affiche._id}`} className="m-2 h-[40px] w-[40px] p-2 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
                        <i class="fa-solid fa-pencil"></i>
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => deleteAffiches(Affiche._id)} className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
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