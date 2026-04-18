import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AddCarousel from '../Controllers/carousel/addCarousel'
import UpdateCarousel from '../Controllers/carousel/updateCarousel'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'
import Page404 from '../pages/404'


const AdminCarousels = () => {
  const [carousels, setCarousels] = useState()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = onSnapshot(collection(db, 'carousel'), snap => {
      setLoading(true)
      const data = snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      })).filter(e => !e.removed)

      if (data) {
        setCarousels(data)
      } else {
        setCarousels(null)
      }
      setLoading(false)
    })

    return () => fetchData
  }, [])

  const deleteAddCarousel = async (carouselId) => {
    await updateDoc(doc(db, 'carousel', carouselId), { removed: true })
  }

  const toggleDisplay = async (carouselId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await updateDoc(doc(db, 'carousel', carouselId), {
        displayed: updatedValue,
      });

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <Loading></Loading>
  if (!carousels) return null


  return (
    <div className='page'>
      <AddCarousel></AddCarousel>
      <div className='flex flex-wrap'>
        {
          carousels.map(carousel => (
            <div key={carousel._id} className='border bg-gray-100 duration-100 m-1 rounded w-[300px] max-[600px]:w-full bg- flex flex-col'>
              {
                carousel.image ?
                  <img src={carousel.image} alt="" className={`h-[200px] bg-black rounded-t-md object-cover duration-100`} /> :
                  <img src={"/bg/carousel-bg.jpg"} alt="" className='h-[200px] rounded object-cover' />
              }
              <div className='flex justify-between items-center mt-2 border-t border-gray-300 p-2'>
                <button className='btn btn-danger' onClick={(e) => {
                  deleteAddCarousel(carousel._id)
                }}>
                  <i className='fa-solid fa-trash'></i>
                </button>

                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" onChange={() => {
                    toggleDisplay(carousel._id, carousel.displayed)
                  }}
                    checked={carousel.displayed} />
                </div>

                <UpdateCarousel carouselId={carousel._id} />

              </div>
              <div className='m-1 line-clamp-2'>{carousel.title}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AdminCarousels