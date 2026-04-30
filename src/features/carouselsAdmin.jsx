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
      const data = snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      })).filter(e => !e.removed)

      setCarousels(data)

      setLoading(false)
    })

    return () => fetchData()
  }, [])

  const deleteCarousel = async (carouselId) => {
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
  // if (!carousels?.length) return <Page404 message={'Aucun carousel'} noLinked={true} errorNumber={' '} />

  return (
    <div className='page'>
      <AddCarousel></AddCarousel>
      <div className='flex flex-wrap'>
        {
          !carousels?.length ? <div className='flex justify-center items-center w-full h-[80vh]'>Aucun carousel</div> :
            carousels.map(carousel => (
              <div key={carousel._id} className='border bg-gray-100 duration-100 m-1 rounded w-[300px] max-[600px]:w-full bg- flex flex-col'>
                {
                  carousel.image
                    ? <img src={`${carousel.image}?tr=w-300,h-200`} alt="" className="h-[200px] object-contain rounded-t-md" />
                    : <img src={"/bg/photo-bg.jpg"} alt="" className='h-[200px] rounded object-contain' />
                }
                <div className='flex justify-between items-center mt-2 border-t border-gray-300 p-2'>
                  <button className='btn btn-danger' onClick={(e) => {
                    deleteCarousel(carousel._id)
                  }}>
                    <i className='fa-solid fa-trash'></i>
                  </button>

                  <div className="form-check form-switch">
                    <input className="form-check-input cursor-pointer" type="checkbox" role="switch" id="switchCheckDefault" onChange={() => {
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