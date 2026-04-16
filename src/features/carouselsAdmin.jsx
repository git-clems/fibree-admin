import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AddCarousel from '../ux/addCarousel'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'
import Page404 from '../pages/404'


const AdminCarousels = () => {
  const [carousels, setCarousels] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const fetchData = onSnapshot(collection(db, 'carousel'), snap => {
      setLoading(true)
      const data = snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))

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
    await deleteDoc(doc(db, 'carousel', carouselId))
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (carouselId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await updateDoc(doc(db, 'carousel', carouselId), {
        displayed: updatedValue,
      });

      // Mise à jour du state (UI instantanée)
      setCarousels((prevCarousels) =>
        prevCarousels.map((carousel) =>
          carousel._id === carouselId ?
            { ...carousel, displayed: updatedValue }
            : carousel
        ));
    } catch (error) {
      console.log(error);
    }
  };

  // while (!carousels) {
  //   return <Loading></Loading>
  // }

  if (loading) return <Loading></Loading>
  if(!carousels) return <Page404></Page404>


  return (
    <div className='page'>
      <AddCarousel></AddCarousel>
      <div className='flex justify-center flex-wrap'>
        {
          carousels.map(carousel => (
            <div className='border  duration-100 m-1 rounded p-2 w-[300px] max-[600px]:w-full bg-white flex flex-col'>
              {
                carousel.image ?
                  <img src={carousel.image} alt="" className={`h-[200px] bg-black rounded border object-contain hover:object-cover duration-100 p-2`} /> :
                  <img src={"/bg/carousel-bg.jpg"} alt="" className='h-[200px] rounded border object-contain' />
              }
              <div className='flex justify-between items-center mt-2 mb-2'>
                <button className='btn btn-danger' onClick={(e) => {
                  e.stopPropagation()
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

                <button className='btn btn-primary' onClick={() => {
                  navigate(`/affiche-carousel/${carousel._id}`)
                }}>
                  Voir
                </button>

              </div>
              <div className=''>{carousel.title}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AdminCarousels