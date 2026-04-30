import React, { useEffect, useState, } from 'react'
import axios from 'axios'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db } from '../../auth/firebase';
import { addDoc, collection, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import infoSchema from '../../models/infoModel'
import { authenticator } from '../../auth/imageKit'
import { upload } from '@imagekit/javascript';
import Loading from '../../components/LoadingPage';

const UpdateInfo = ({ infoId }) => {

    const [info, setInfo] = useState(null)
    const [initialInfo, setInitialInfo] = useState(null)
    const [typeCheck, setTypeCheck] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState({})


    useEffect(() => {
        if (!open) return
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, 'infos', infoId))
                if (snap.exists()) {
                    setInfo({ _id: snap.id, ...snap.data() })
                    setInitialInfo({ _id: snap.id, ...snap.data() })
                } else {
                    setInfo(null)
                }
            } catch (error) {
                setInfo(null)
            }
        }

        fetchData()
    }, [open, infoId])


    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            setMessage('')
            setErrors({})
        }

        return () => document.body.style.overflow = "auto";
    }, [open]);

    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)

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
                folder: "/info",
                token: token,
                signature: signature,
                expire: expire,
                publicKey: publicKey
            })

            return await uploadResponse.url
        } catch (error) {
            setMessage("L'image n'a pas été enregistrée !")
            return null
        } finally {
            setUploading(false)
        }
    }

    const inputHandler = (e) => {
        const { name, value, type, checked } = e.target;
        setInfo({
            ...info, [name]:
                type === "checkbox"
                    ? checked
                    : value
        })
    }

    const ErrorHandler = () => {
        const newErrors = {}
        if (!info.title?.trim()) {
            newErrors.title = 'Le titre est obligatoire'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const SubmitForm = async (e) => {
        e.preventDefault()

        const isValid = ErrorHandler()

        if (!isValid) return

        setLoading(true)

        try {
            const imageUrl = await uploadImage()

            await updateDoc(doc(db, 'infos', infoId), {
                ...info,
                image: imageUrl || initialInfo.image,
                updateAt: Timestamp.fromDate(new Date())
            })

            setMessage('Actualité enregistrée avec succès !')
            setOpen(false)
        } catch (error) {
            setMessage("Une erreur s'est produite !!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-2 rounded-t-md '>
            <div className='flex justify-between'>
                <button className='btn btn-primary' onClick={() => setOpen(!open)}> <i class="fa-solid fa-pencil"></i></button>
            </div>
            {
                open &&
                <div className="fixed bg-[rgba(0,0,0,0.5)] flex justify-center h-100 w-100 top-0 pt-0 left-0 z-500 duration-200 transition-transform">
                    {
                        !info
                            ? <Loading></Loading>
                            : <form onSubmit={SubmitForm} className={'bg-gray-100 mt-2 rounded-md flex-col h-[max-content] min-[600px]:w-[60%]'}>

                                <div class="flex justify-between items-center rounded-t-md shadow-[0_0_5px_rgba(0,0,0,0.2)] overflow-hidden p-2">
                                    <span class="font-bold text-xl line-clamp-1" id="">{initialInfo?.title}</span>
                                    <button type="button" class="btn-close" onClick={() => setOpen(!open)} aria-label="Close"></button>
                                </div>
                                <div class="m-2 p-2 max-h-[70vh] overflow-auto">

                                    <div className='flex justify-between flex-wrap'>

                                        <div class="mt-4 m-1 flex-1 min-w-[300px]">
                                            <div className='flex justify-between'>
                                                <label className="form-label">Titre <span className='text-red-500'> * </span> </label>
                                                {errors?.title && (<span className='text-red-500'>{errors.title}</span>)}
                                            </div>
                                            <input type="text" onChange={inputHandler} name='title' value={info?.title || ''} className={`form-control`} placeholder="Titre de l'actualité" />
                                        </div>
                                    </div>

                                    <div class="mt-4 m-1">
                                        <label for="" class="form-label">Sous-titre</label>
                                        <textarea type="text" onChange={inputHandler} name='subtitle' value={info?.subtitle || ''} class="form-control" placeholder="Sous-titre de l'actualité" />
                                    </div>


                                    <div class="mt-4 m-1">
                                        <label for="exampleFormControlTextarea1" class="form-label">Contenu de l'actualité</label>
                                        <textarea class="form-control" name='description' value={info?.description || ''} onChange={inputHandler} rows="10"></textarea>
                                    </div>



                                    <div class="mt-4 m-1">
                                        <label class="form-label">Image d'illustration</label>
                                        <input type="file" accept="image/*" onChange={handleFile} title='image' class="form-control" placeholder='Choisir une image' />
                                    </div>
                                </div>

                                <div className='shadow-[0_0_5px_rgba(0,0,0,0.2)] p-2'>
                                    <div class="flex justify-between">
                                        <button type="button" className="btn btn-secondary m-1" disabled={loading || uploading} onClick={() => { setOpen(false) }}>Annuler</button>
                                        <button type="submit" class="btn btn-primary" disabled={loading || uploading}>{loading ? "Chargement..." : "Enregistrer"}</button>
                                    </div>
                                    <div className={`text-center ${message.includes('succès') ? 'text-green-500' : 'text-red-500'} `}>
                                        <span className=''>{message}</span>
                                    </div>
                                </div>
                            </form>
                    }
                </div>
            }
        </div>
    )
}

export default UpdateInfo