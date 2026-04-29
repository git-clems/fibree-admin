// import React, { useEffect, useMemo, useState, } from 'react'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import { db } from '../../auth/firebase';
// import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
// import carouselSchema from '../../models/carouselModel'
// import Loading from '../../components/LoadingPage';

// const UpdateCarousel = ({ carouselId }) => {

//     const [open, setOpen] = useState(false)
//     const [carousel, setCarousel] = useState(null)
//     const [initialCarousel, setInitialCarousel] = useState(null)

//     useEffect(() => {
//         if (!open) return
//         const fetchData = async () => {
//             try {
//                 const snap = await getDoc(doc(db, 'carousel', carouselId))
//                 if (snap.exists()) {
//                     setCarousel({ _id: snap.id, ...snap.data() })
//                     setInitialCarousel({ _id: snap.id, ...snap.data() })
//                 } else {
//                     setCarousel(carouselSchema)
//                 }
//             } catch (error) {
//                 setCarousel(carouselSchema)
//             }
//         }

//         fetchData()
//     }, [open, carouselId])

//     const [message, setMessage] = useState('')
//     const [loading, setLoading] = useState(false)


// useEffect(() => {
//     if (open) {
//         document.body.style.overflow = "hidden";
//     } else {
//         document.body.style.overflow = "auto";
//         setMessage('')
//     }

//     return () => document.body.style.overflow = "auto";
// }, [open]);

//     const inputHandler = (e) => {
//         const { name, value } = e.target;
//         setCarousel(prev => ({ ...prev, [name]: value }))
//     }

//     const SubmitForm = async (e) => {
//         setLoading(true)
//         e.preventDefault()
//         try {
//             await updateDoc(doc(db, 'carousel', carouselId), carousel)
//             setMessage('Information enregistré avec succès !')
//             setOpen(false)
//         } catch (error) {
//             setMessage("Une erreur s'est produite !!")
//         } finally {
//             setLoading(false)
//         }
//     }


//     const isChanged = useMemo(() => {
//         if (!carousel || !initialCarousel) return null
//         return JSON.stringify(carousel) !== JSON.stringify(initialCarousel)
//     })

//     return (

//         <div className='p-2 rounded-t-md '>
//             <div className='flex justify-between'>
//                 <button className='btn btn-primary' onClick={() => setOpen(!open)}> <i className="fa-solid fa-pen"></i></button>
//             </div>
//             {
//                 open &&

//                 <div className={`fixed bg-[rgba(0,0,0,0.5)]  flex justify-center p-2 h-100 w-100 top-0 pt-0 left-0 z-500`}>
//                     {
//                         !carousel ? <Loading /> :

//                             <form onSubmit={SubmitForm} className={'border border-gray-200 bg-white max-w-[500px] mt-2 rounded-md flex-col h-[max-content] '}>
//                                 <div className='border-b border-gray-300 line-clamp-1 font-bold m-2'>{initialCarousel.title}</div>

//                                 <div className="max-h-[70vh] overflow-auto mt-4 m-1">
//                                     <div className="mb-3 m-1">
//                                         <label for="" className="form-label">Nom</label>
//                                         <input type="text" value={carousel?.title || ''} onChange={inputHandler} name='title' className="form-control" placeholder="Nom du carousel" />
//                                     </div>

//                                     <div className="mb-3 m-1">
//                                         <label for="inputGroupFile02" className="form-label">Images</label>
//                                         <input type="file" accept="image/*" title='image' className="form-control" placeholder='Choisir une image' />
//                                     </div>
//                                 </div>
//                                 <div className="modal-footer">
//                                     <button type="button" className="btn btn-secondary m-1" onClick={() => { setOpen(false) }}>Annuler</button>
//                                     <button type="submit" className="btn btn-primary m-1" disabled={!isChanged || loading}>{loading ? "Chargement..." : "Modifier"}</button>
//                                 </div>
//                                 <div className={`text-center ${message.includes('succès') ? 'text-green-500' : 'text-red-500'} `}>
//                                     <span className=''>{message}</span>
//                                 </div>
//                             </form>
//                     }
//                 </div>
//             }
//         </div>
//     )
// }

// export default UpdateCarousel

import { useEffect, useMemo, useState, } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { addDoc, collection, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../auth/firebase';
import carouselSchema from '../../models/carouselModel';
import Loading from '../../components/LoadingPage';
import { upload } from '@imagekit/react'
import { authenticator } from '../../auth/imageKit';


const UpdateCarousel = ({ carouselId }) => {
    const [open, setOpen] = useState(false)
    const [carousel, setCarousel] = useState(null)
    const [initialCarousel, setInitialCarousel] = useState(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (!open) return
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, 'carousel', carouselId))
                if (snap.exists()) {
                    setCarousel({ _id: snap.id, ...snap.data() })
                    setInitialCarousel({ _id: snap.id, ...snap.data() })
                } else {
                    setCarousel(null)
                }
            } catch (error) {
                setCarousel(null)
            }
        }

        fetchData()
    }, [open, carouselId])

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }


    const uploadImage = async () => {
        if (!file) return null

        try {
            setUploading(true)

            const authParams = await authenticator()
            const { token, expire, signature, publicKey } = authParams

            const uploadResponse = await upload({
                file,
                fileName: file.name,
                folder: "/carousel",
                token: token,
                signature: signature,
                expire: expire,
                publicKey: publicKey
            })

            return await uploadResponse.url
        } catch (error) {
            console.log(error)
            setMessage("L'image n'a pas été enregistrée !")
            return null
        } finally {
            setUploading(false)
        }
    }

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setCarousel(prev => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            setMessage('')
        }

        return () => document.body.style.overflow = "auto";
    }, [open]);

    const SubmitForm = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const imageUrl = await uploadImage()

            await updateDoc(doc(db, 'carousel', carouselId), {
                ...carousel,
                image: imageUrl || initialCarousel?.image,
                updateAt: Timestamp.fromDate(new Date())
            })
            setMessage('Carousel modifié avec succès !')
            setOpen(false)
        } catch (error) {
            setMessage("Une erreur s'est produite !!")
        } finally {
            setLoading(false)
        }
    }


    const isChanged = useMemo(() => {
        if (!carousel || !initialCarousel) return null
        return JSON.stringify(carousel) !== JSON.stringify(initialCarousel)
    })

    return (
        <div className='p-2 rounded-t-md '>
            <div className='flex justify-between'>
                <button className='btn btn-primary' onClick={() => setOpen(!open)}> <i className="fa-solid fa-pen"></i></button>
            </div>
            {
                open &&
                <div className="fixed bg-[rgba(0,0,0,0.5)] flex justify-center h-100 w-100 top-0 pt-0 left-0 z-500 duration-200 transition-transform">
                    {
                        !carousel ? <Loading /> :
                            <form onSubmit={SubmitForm} className={'bg- border border-gray-200 bg-white max-w-[500px] mt-2 rounded-md flex-col h-[max-content] '}>
                                <div className='border-b border-gray-300 line-clamp-1 font-bold m-2'>{initialCarousel?.title}</div>

                                <div className="max-h-[70vh] overflow-auto mt-4 m-1">
                                    <div className="mb-3 m-1">
                                        <label for="" className="form-label">Nom</label>
                                        <input type="text" onChange={inputHandler} value={carousel?.title || ""} name='title' className="form-control" placeholder="Nom du carousel" />
                                    </div>

                                    <div className="mb-3 m-1">
                                        <div className='flex justify-between'>
                                            <label for="" className="form-label">Images <span className='text-red-500'> * </span></label>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleFile} title='image' className="form-control" placeholder='Choisir une image' />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary m-1 h-10" disabled={loading || uploading} onClick={() => { setOpen(false) }}>Annuler</button>
                                    <button type="submit" className="btn btn-primary m-1 h-10 w-30 flex justify-center items-center" disabled={loading || uploading}>
                                        {loading || uploading
                                            ? <div class="spinner-border" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                            : "Modifier"}
                                    </button>
                                </div>
                                <div className={`text-center ${message.includes('succès') ? 'text-green-500' : 'text-red-500'} `}>{message}</div>
                            </form>
                    }

                </div>
            }
        </div>
    )
}

export default UpdateCarousel
