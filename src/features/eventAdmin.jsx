import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddEvent from '../Controllers/event/addEvent'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'


const AdminEvents = () => {
  const [events, setEvents] = useState()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const fetchData = onSnapshot(collection(db, 'event'), snap => {
      const data = snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))

      setEvents(data.filter(e => !e.removed) || null)
      setLoading(false)
    })

    return () => fetchData
  }, [])

  const deleteEvent = async (eventId) => {
    await updateDoc(doc(db, 'event', eventId), { removed: true })
      .catch((e) => console.log(e)
      )
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

  if (loading) return <Loading />
  if (!events) return null


  return (
    <div className='page'>
      <AddEvent></AddEvent>
      <div className='flex flex-wrap'>
        {
          !events?.length ? <div className='flex justify-center items-center w-full h-[80vh]'>Aucun évènement enrégistré</div> :
            events.map(event => (
              <div key={event._id} to={`/evenement/${event._id}`} className='border  duration-100 m-1 rounded w-[300px] max-[600px]:w-full bg-white flex flex-col'>
                {
                  event.image ?
                    <img src={event.image} alt="" className={`h-[200px] bg-black rounded-t-md object-cover`} /> :
                    <img src={"/bg/event-bg.jpg"} alt="" className='h-[200px] rounded-t-md object-cover' />
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
                  <div className='line-clamp-2'>{event.title}</div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  )
}

export default AdminEvents