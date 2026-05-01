import React, { useEffect, useState, } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db } from '../../auth/firebase';
import { addDoc, collection, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { authenticator } from '../../auth/imageKit'
import { upload } from '@imagekit/javascript';
import Loading from '../../components/LoadingPage';

const UpdateStatistic = ({ statisticId }) => {

    const [statistic, setStatistic] = useState(null)
    const [initialStatistic, setInitialStatistic] = useState(null)
    const [typeCheck, setTypeCheck] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState({})


    useEffect(() => {
        if (!open) return
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, 'statistic', statisticId))
                if (snap.exists()) {
                    setStatistic({ _id: snap.id, ...snap.data() })
                    setInitialStatistic({ _id: snap.id, ...snap.data() })
                } else {
                    setStatistic(null)
                }
            } catch (error) {
                setStatistic(null)
            }
        }

        fetchData()
    }, [open, statisticId])


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
                folder: "/statistic",
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
        setStatistic({
            ...statistic, [name]:
                type === "checkbox"
                    ? checked
                    : value
        })
    }


    const ErrorHandler = () => {
        const newErrors = {}
        if (!statistic.description?.trim()) {
            newErrors.description = 'Ajouter une description'
        }
        if (!statistic.metric) {
            newErrors.metric = 'La métrique est obligatoire'
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

            await updateDoc(doc(db, 'statistic', statisticId), {
                ...statistic,
                image: imageUrl || initialStatistic.image,
                updateAt: Timestamp.fromDate(new Date())
            })

            setMessage('Statistique modifié avec succès !')
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
                <button className="m-1 h-[40px] w-[40px] flex justify-center items-center bg-blue-600 hover:bg-blue-400 rounded-1 text-[white]" onClick={() => setOpen(!open)}><i class="fa-solid fa-pen"></i></button>
            </div>
            {
                open &&
                <div className="fixed bg-[rgba(0,0,0,0.5)] flex justify-center h-100 w-100 top-0 pt-0 left-0 z-500 duration-200 transition-transform">
                    {
                        !statistic
                            ? <Loading></Loading>
                            : <form onSubmit={SubmitForm} className={'bg-gray-100 mt-2 m-2 rounded-md flex-col h-[max-content] min-[600px]:w-[60%]'}>

                                <div class="flex justify-between rounded-t-md shadow-[0_0_5px_rgba(0,0,0,0.2)] overflow-hidden p-2">
                                    <span class="text-xl font-bold line-clamp-1">{initialStatistic.description}</span>
                                    <button type="button" disabled={loading || uploading} class="btn-close" onClick={() => setOpen(!open)} aria-label="Close"></button>
                                </div>
                                <div class="m-2 p-2 max-h-[70vh] overflow-auto">

                                    <div className='flex justify-between flex-wrap'>

                                        <div class="mt-4 m-1 flex-1 min-w-[300px]">
                                            <div className='flex justify-between'>
                                                <label className="form-label">La mésure <span className='text-red-500'> * </span> </label>
                                                {errors?.metric && (<span className='text-red-500'>{errors.metric}</span>)}
                                            </div>
                                            <input type="number" min={0} onChange={inputHandler} name='metric' value={statistic?.metric || ''} className={`form-control`} placeholder="Entrez la métrique" />
                                        </div>
                                    </div>
                                    <div className='flex justify-between flex-wrap'>

                                        <div class="mt-4 m-1 flex-1 min-w-[300px]">
                                            <div className='flex justify-between'>
                                                <label className="form-label">Description <span className='text-red-500'> * </span> </label>
                                                {errors?.description && (<span className='text-red-500'>{errors.description}</span>)}
                                            </div>
                                            <textarea type="text" onChange={inputHandler} name='description' value={statistic?.description || ''} className={`form-control`} rows={6} placeholder="Décrire la statistique" />
                                        </div>
                                    </div>

                                    <div class="mt-4 m-1">
                                        <label class="form-label">Image d'illustration</label>
                                        <input type="file" accept="image/*" onChange={handleFile} class="form-control" placeholder='Choisir une image' />
                                    </div>
                                </div>

                                <div className='shadow-[0_0_5px_rgba(0,0,0,0.2)] p-2'>
                                    <div class="flex justify-between">
                                        <button type="button" className="btn btn-secondary m-1" disabled={loading || uploading} onClick={() => { setOpen(false) }}>Annuler</button>
                                        <button type="submit" class="btn btn-primary" disabled={loading || uploading}>{loading ? "Chargement..." : "Modifier"}</button>
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

export default UpdateStatistic