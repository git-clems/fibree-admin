import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import AddEvent from '../ux/addEvent'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'


const AdminEvents = () => {
  const [events, setEvents] = useState()

  // useEffect(() => {
  //   const fectData = onSnapshot(collection(db, 'event'), snap => setEvents(
  //         snap.docs.map(doc=>({
  //           _id: doc.id,
  //           ...doc.data()
  //         }))
  //       ))
  //     }
  //     return () => fectData();
  // }, [])

  useEffect(() => {
    const fetchData = onSnapshot(collection(db, 'event'), snap => setEvents(
      snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))
    ))
    return () => fetchData
  }, [])

  const deleteEvents = async (eventId) => {
    await deleteDoc(doc(db, 'event', eventId))
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (eventId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await updateDoc(doc(db, 'event', eventId), {
        displayed: updatedValue,
      });

      // Mise à jour du state (UI instantanée)
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ?
            { ...event, displayed: updatedValue }
            : event
        ));
    } catch (error) {
      console.log(error);
    }
  };

  while (!events) {
    return <Loading></Loading>
  }


  return (
    <div className='page'>
      <>
        <AddEvent></AddEvent>
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
            {events.map((event, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>
                  <h6>{event.title}</h6>
                  <p className='text-gray-500 truncate max-w-[60vw]'>{event.subtitle}</p>
                </td>
                <td>
                  <input type="checkbox" className="m-2"
                    checked={event.displayed}
                    onChange={() => toggleDisplay(event._id, event.displayed)} />
                </td>
                <td>
                  <Link style={{ borderRadius: 5 }} to={`/admin/actualite/${event._id}`} className="m-2 h-[40px] w-[40px] p-2 flex justify-center items-center bg-green-400 hover:bg-green-300 rouded-1 ">
                    <i class="fa-solid fa-pencil"></i>
                  </Link>
                </td>
                <td>
                  <button onClick={() => deleteEvents(event._id)} className="m-2 h-[40px] w-[40px] flex justify-center items-center bg-[red] hover:bg-red-400 rounded-1 text-[white]">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </>
    </div>
  )
}

export default AdminEvents