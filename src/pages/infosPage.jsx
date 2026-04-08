import React, { useEffect, useState } from 'react'
import Info from '../components/info';
import axios from 'axios';
import { Link } from 'react-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../auth/firebase';
import Loading from '../components/LoadingPage';

const Infos = () => {
    const [infos, setInfos] = useState()
    useEffect(() => {
        const fectData = async () => {
            try {
                // const response = await axios.get('http://localhost:8000/api/info')
                const response = await getDocs(collection(db,'infos'))
                const data = response.docs.map((doc)=>({
                    _id : doc.id,
                    ...doc.data()
                }))
                setInfos(data)
            } catch (error) {
                console.log(error);
            }
        };
        fectData();
    }, [])

    while (!infos) {
        return <Loading></Loading>
    }

    return (
        <div className='page'>
            {
                (infos && infos.length > 0) &&
                <div className="m-2">
                    <h2 className='text-center'>Nos actualités</h2>
                    <div className="flex-1 flex flex-wrap justify-center">
                        {infos.map((info) => (info.displayed &&(<Info infoId={info._id}></Info>)))}
                    </div>
                </div>
            }</div>
    )
}

export default Infos