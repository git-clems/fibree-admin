import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../features/adminInfos";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";


const DetailsInfo = () => {
    const [info, setInfo] = useState();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDocs(collection(db, 'infos'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                const foundInfo = data.find((e) => e._id === id);
                setInfo(foundInfo || null);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [id]);

    while (!info) { return <Loading></Loading> }


    return (
        <div className="page details-page">
            <div className="flex flex-wrap">
                <div lang="fr" className="ml-5 mr-5 description ">
                    <h4 className="name">{info.title}</h4>
                    <p lang="fr" className="text-gray-500 text-justify [hyphens:auto] break-words">{info.subtitle}</p>
                    <span className='text-gray-500'>Date de publication : {formatDate(info.publishDate)}</span>
                </div>
                <div className="p-4 mt-4 bg-gray-100" style={{ float: 'left' }}>
                    <img src={info.images[0]} alt="" className=" rounded-2xl border border-gray-300 float-right h-[300px] object-cover ml-4 mr-2" />

                    {info.description.split('\n').map((paragraph, index) => (
                        <p key={index} lang="fr" className={`text-justify [hyphens:auto] break-words mb-4 ${index === 0 ? 'first-letter:text-[30px] first-letter:font-bold first-letter:ml-10' : ''}`}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailsInfo;