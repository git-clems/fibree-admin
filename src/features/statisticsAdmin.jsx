import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AddStatistic from '../ux/addStatistic'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import Loading from '../components/LoadingPage'
import Page404 from '../pages/404'


const AdminStatistics = () => {
  const [statistics, setStatistics] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    const fetchData = onSnapshot(collection(db, 'statistic'), snap => {
      setLoading(true)
      const data = snap.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))

      if (data) {
        setStatistics(data)
      } else {
        setStatistics(null)
      }
      setLoading(false)
    })

    return () => fetchData
  }, [])

  const deleteAddStatistic = async (statisticId) => {
    await deleteDoc(doc(db, 'statistic', statisticId))
      .catch((error) => {
        console.log(error)
      })
  }

  const toggleDisplay = async (statisticId, currentValue) => {
    try {
      const updatedValue = !currentValue;
      await updateDoc(doc(db, 'statistic', statisticId), {
        displayed: updatedValue,
      });


      setStatistics((prevStatistics) =>
        prevStatistics.map((statistic) =>
          statistic._id === statisticId ?
            { ...statistic, displayed: updatedValue }
            : statistic
        ));
    } catch (error) {
      console.log(error);
    }
  };


  if (loading) return <Loading></Loading>
  if (!statistics) return <Page404></Page404>


  return (
    <div className='page'>
      <AddStatistic></AddStatistic>
      <div className='flex justify-center flex-wrap'>
        {
          statistics.map(statistic => (
            <div className='border  duration-100 m-1 rounded p-2 w-[300px] max-[600px]:w-full bg-white flex flex-col justify-cente items-center bg-red-200'>
              {
                statistic.image ?
                  <img src={statistic.image} alt="" className={`h-[200px] rounded object-contain hover:object-cover duration-100 p-2`} /> :
                  <img src={"/bg/statistic-bg.jpg"} alt="" className='h-[200px] rounded object-contain' />
              }
              <h4>{statistic.value}</h4>
              <p>{statistic.description}</p>
              <div className='flex justify-between items-center w-full mt-2 mb-2'>
                <button className='btn btn-danger' onClick={(e) => {
                  e.stopPropagation()
                  deleteAddStatistic(statistic._id)
                }}>
                  <i className='fa-solid fa-trash'></i>
                </button>

                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" onChange={() => {
                    toggleDisplay(statistic._id, statistic.displayed)
                  }}
                    checked={statistic.displayed} />
                </div>

                <button className='btn btn-primary' onClick={() => { }}>
                  <i className='fa-solid fa-pen'></i>
                </button>

              </div>
              <div className=''>{statistic.title}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AdminStatistics