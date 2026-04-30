import React, { useEffect, useState, } from 'react'
import axios from 'axios'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db } from '../../auth/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import missionSchema from '../../models/missionModel'
import { authenticator } from '../../auth/imageKit'
import { upload } from '@imagekit/javascript';

const AddMission = () => {

    const [mission, setMission] = useState(missionSchema)
    const [typeCheck, setTypeCheck] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            setMessage('')
            setMission(missionSchema)
            setErrors({})
            setFile(null)
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
                folder: "/mission",
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
        setMission({
            ...mission, [name]:
                type === "checkbox"
                    ? checked
                    : value
        })
    }

    const ErrorHandler = () => {
        const newErrors = {}
        if (!mission.title?.trim()) {
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

            await addDoc(collection(db, 'mission'), {
                ...mission,
                image: imageUrl,
                createAt: Timestamp.fromDate(new Date())
            })

            setMessage('Mission enregistré avec succès !')
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
                <h2>Nos missions</h2>
                <button className='btn btn-primary' onClick={() => setOpen(!open)}><span className="max-[800px]:hidden">Ajouter une mission</span> <i class="fa-solid fa-plus"></i></button>
            </div>
            {
                open &&
                <div className="fixed bg-[rgba(0,0,0,0.5)] flex justify-center h-100 w-100 top-0 pt-0 left-0 z-500 duration-200 transition-transform">
                    <form onSubmit={SubmitForm} className={'bg-gray-100 mt-2 rounded-md flex-col h-[max-content] min-[600px]:w-[60%]'}>

                        <div class="flex justify-between rounded-t-md shadow-[0_0_5px_rgba(0,0,0,0.2)] overflow-hidden p-2">
                            <h1 class="fs-5" id="staticBackdropLabel">Nouvelle mission</h1>
                            <button type="button" class="btn-close" onClick={() => setOpen(!open)} aria-label="Close"></button>
                        </div>
                        <div class="m-2 p-2 max-h-[70vh] overflow-auto">

                            <div className='flex justify-between flex-wrap'>

                                <div class="mt-4 m-1 flex-1 min-w-[300px]">
                                    <div className='flex justify-between'>
                                        <label className="form-label">Intitulé <span className='text-red-500'> * </span> </label>
                                        {errors?.title && (<span className='text-red-500'>{errors.title}</span>)}
                                    </div>
                                    <input type="text" onChange={inputHandler} name='title' value={mission?.title || ''} className={`form-control`} placeholder="Intitulé de la mission" />
                                </div>
                            </div>

                            <div class="mt-4 m-1">
                                <label for="" class="form-label">Description de la mission</label>
                                <textarea class="form-control" name='description' onChange={inputHandler} title='description' rows="6"></textarea>
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
                </div>
            }
        </div>
    )
}

export default AddMission