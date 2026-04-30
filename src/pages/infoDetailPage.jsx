import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";
import Page404 from "./404";
import { PublishTime } from "../features/admin";

const DetailsInfo = () => {
    const [info, setInfo] = useState();
    const { id } = useParams();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const snapDoc = await getDoc(doc(db, 'infos', id))
                if (snapDoc.exists()) {
                    setInfo({ _id: snapDoc.id, ...snapDoc.data() });
                } else {
                    setInfo(null)
                }
            } catch (error) {
                console.log(error);
                setInfo(null)
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <Loading></Loading>
    if (!info) { return <Page404 message={"Evènement non trouvé"} prev={"Revenir aux évènemts"} prevLink={'/evenement'} /> }

    return (
        <div className="page details-page">
            <div className="flex flex-wrap">
                <div className="m-2 w-full bg-gray-200 rounded p-2 max-[600px]:w-full">
                    <p className="name text-xl font-bold">{info.title}</p>
                    <p className="text-gray-500">{info.subtitle}</p>
                    {/* <div className='flex justify-between'>
                        {info.publishDate && <div className='text-sm truncate rounded '>Date de publication: {PublishTime(info?.publishDate)}</div>}
                    </div> */}
                    {
                        info?.updateAt
                            ? <div className="mt-2 text-xs">Dernière mise à jour : {PublishTime(info.updateAt)}</div>
                            : <div className="mt-2 text-xs">Date de publication : {PublishTime(info.publishDate)}</div>
                    }
                    {
                        info.link &&
                        <Link to={info.link} className='' target="_blank"><span className="pl-1 pr-1 bg-yellow-500 underline hover:text-blue-500">{info.linkMessage}</span></Link>
                    }
                </div>

                <div className="m-2 max-[600px]:w-full bg-gray-200 p-2 w-full rounded" style={{ float: 'left' }}>
                    <img src={info.image || '/bg/info-bg.jpg'} alt="" className="
                        rounded
                        border-1
                        border-gray-300
                        float-right
                        
                        max-h-100
                        object-cover
                        max-[600px]:w-full
                        min-[600px]:ml-4 min-[600px]:mr-4"/>
                    <div>
                        {info.description.split('\n').map(paragraph => (
                            <p className="ml-2 mr-4 text- first-letter:ml-5">{paragraph}</p>
                        ))}
                    </div>
                </div>

                {
                    info.images?.slice(1,)?.length > 0 &&
                    <div className="border-t border-gray-200 m-2 w-full">
                        <h4 className="ml-3 mt-3">Images associées</h4>
                        <div className="flex flex-wrap">
                            {
                                info.images.slice(1,)?.map(image => (
                                    <img src={image} alt="" className="max-h-[300px] rounded m-1" />
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default DetailsInfo;