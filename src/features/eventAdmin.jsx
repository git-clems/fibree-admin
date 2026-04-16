import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddEvent from '../ux/addEvent'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'


const AdminEvents = () => {
  const [events, setEvents] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = onSnapshot(collection(db, 'event'), snap => setEvents(
      snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))
    ))
    return () => fetchData
  }, [])

  const deleteEvent = async (eventId) => {
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
      <AddEvent></AddEvent>
      <div className='flex justify-center flex-wrap'>
        {
          events.map(event => (
            <div key={event._id} to={`/evenement/${event._id}`} className='border  duration-100 m-1 rounded w-[300px] max-[600px]:w-full bg-white flex flex-col'>
              {
                event.image ?
                  <img src={event.image} alt="" className={`h-[200px] bg-black rounded-t-md object-contain hover:object-cover duration-100 p-2`} /> :
                  <img src={"/bg/event-bg.jpg"} alt="" className='h-[200px] rounded-t-md object-contain' />
              }
              <div className='p-2 border-t border-gray-200'>
                <div className='flex justify-between items-center mt-2 mb-2'>
                  <button className='btn btn-danger' onClick={(e) => {
                    e.stopPropagation()
                    deleteEvent(event._id)
                  }}>
                    <i className='fa-solid fa-trash'></i>
                  </button>

                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" onChange={() => {
                      toggleDisplay(event._id, event.displayed)
                    }}
                      checked={event.displayed} />
                  </div>

                  <button className='btn btn-primary' onClick={() => {
                    navigate(`/evenement/${event._id}`)
                  }}>
                    Voir
                  </button>

                </div>
                <div className=''>{event.title}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AdminEvents