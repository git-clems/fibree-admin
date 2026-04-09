import React, { useEffect, useState } from 'react'
import Info from '../components/flashInfo';
import axios from 'axios';
import { Link } from 'react-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../auth/firebase';
import Loading from '../components/LoadingPage';

const FlashInfos = () => {
    const [flashInfos, setFlashInfos] = useState()
    useEffect(() => {
        const fectData = async () => {
            try {
                const response = await getDocs(collection(db, 'flash-info'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                setFlashInfos(data)
            } catch (error) {
                console.log(error);
            }
        };
        fectData();
    }, [])

    while (!flashInfos) {
        return <Loading></Loading>
    }

    const Flashinfo = ({flashInfoId}) => {

        const [flashInfo, setFlashInfo] = useState()

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await getDocs(collection(db, 'flash-info'))
                    const data = response.docs.map((doc) => ({
                        _id: doc.id,
                        ...doc.data()
                    }))
                    const foundInfo = data.find((e) => e._id === flashInfoId)
                    setFlashInfo(foundInfo || null);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchData();
        }, [flashInfoId]);


        while (!flashInfo) {
            return (
                <div class="card m-3 h-[450px] w-[300px] border-1 border-gray-300 rounded-md bg-[white] hover:shadow-[0_0_15px_rgba(0,0,25,0.9)] transition-shadow duration-200 overflow-hidden" aria-hidden="true">
                    <div class="card-body">
                        <h5 class="card-title placeholder-glow">
                            <span class="placeholder col-6"></span>
                        </h5>
                        <p class="card-text placeholder-glow">
                            <span class="placeholder col-7"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-4"></span>
                            <span class="placeholder col-6"></span>
                            <span class="placeholder col-8"></span>
                        </p>
                    </div>
                </div>
            )
        }

        return (
            <>
                {flashInfo.displayed &&
                    <Link to={`/flash-info/${flashInfoId}`} className='m-3 max-h-[450px] w-[25vw] min-w-[300px] border-1 border-gray-300 rounded-md bg-[white] hover:shadow-[0_0_15px_rgba(0,0,25,0.9)] transition-shadow duration-200 overflow-hidden'>
                        <div>
                            <img src={flashInfo.image} alt="" className='rounded-t-md h-[200px] w-[100%] object-cover' />
                            <span className='text-sky-50 position-relative top-[-40px] bg-green-500 pl-2 pr-2 pt-1 pb-1 rounded-r-full'>Publié le {flashInfo.publishDate?.toDate().toLocaleString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className='m-2 mt-0'>
                            <span className='font-bold b-4'>{flashInfo.title}</span>
                            <p className='text-sm text-[gray]'> {flashInfo.subtitle} </p>
                        </div>
                    </Link>
                }
            </>
        )
    }



    return (
        <div className='page'>
            <div className="m-2">
                <h2 className='ml-2'>À venir</h2>
                <div className="flex-1 flex flex-wrap justify-center">
                    {flashInfos.map((flashInfo) => (flashInfo.displayed && (<Flashinfo flashInfoId={flashInfo._id}></Flashinfo>)))}
                </div>
            </div>
        </div>
    )
}

export default FlashInfos