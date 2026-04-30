import React, { useEffect, useState, } from 'react'
import axios from 'axios'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db } from '../../auth/firebase';
import { addDoc, collection, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import eventSchema from '../../models/eventModel'
import { authenticator } from '../../auth/imageKit'
import { upload } from '@imagekit/javascript';
import Loading from '../../components/LoadingPage';
import { PublishTime } from '../../features/admin';

const UpdateEvent = ({ eventId }) => {

    const [event, setEvent] = useState(null)
    const [initialEvent, setInitialEvent] = useState(null)
    const [typeCheck, setTypeCheck] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (!open) return
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, 'event', eventId))
                if (snap.exists()) {
                    setEvent({ _id: snap.id, ...snap.data() })
                    setInitialEvent({ _id: snap.id, ...snap.data() })
                } else {
                    setEvent(null)
                }
            } catch (error) {
                setEvent(null)
            }
        }

        fetchData()
    }, [open, eventId])


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
                folder: "/event",
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
        setEvent({
            ...event, [name]:
                type === "checkbox"
                    ? checked
                    : value
        })
    }

    const ErrorHandler = () => {
        const newErrors = {}
        if (!event.title?.trim()) {
            newErrors.title = 'Le titre est obligatoire'
        }
        if (!event.type) {
            newErrors.type = 'Le type est obligatoire'
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

            await updateDoc(doc(db, 'event', eventId), {
                ...event,
                image: imageUrl || initialEvent?.image,
                updateAt: Timestamp.fromDate(new Date())
            })

            setMessage('Evènement enregistré avec succès !')
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
                <button className='btn btn-primary' onClick={() => setOpen(!open)}><i class="fa-solid fa-pen"></i></button>
            </div>
            {
                open &&
                <div className="fixed bg-[rgba(0,0,0,0.5)] flex justify-center h-100 w-100 top-0 pt-0 left-0 z-500 duration-200 transition-transform">
                    {
                        !event
                            ? <Loading></Loading>
                            : <form onSubmit={SubmitForm} className={'bg-gray-100 mt-2 rounded-md flex-col h-[max-content] min-[600px]:w-[60%]'}>

                                <div class="flex justify-between rounded-t-md shadow-[0_0_5px_rgba(0,0,0,0.2)] overflow-hidden p-2">
                                    <span class="font-bold text-xl line-clamp-1" id="">{initialEvent?.title}</span>
                                    <button type="button" class="btn-close" onClick={() => setOpen(!open)} aria-label="Close"></button>
                                </div>
                                <div class="m-2 p-2 max-h-[70vh] overflow-auto">

                                    <div className='flex justify-between flex-wrap'>
                                        <div className="mt-4 m-1 flex-1 min-w-[300px]">
                                            <div className='flex justify-between'>
                                                <label htmlFor="" className="form-label"> Type d'évènement<span className='text-red-500'> * </span> </label>
                                                {errors?.type && (<span className='text-red-500'>{errors.type}</span>)}
                                            </div>
                                            {
                                                typeCheck ?
                                                    <input type='text' onChange={inputHandler} className="form-control" value={event?.type || ''} name='type' rows="3" placeholder="Ex: Forum"></input> :
                                                    <select class="form-select " autocomplete="type" onChange={inputHandler} name="type">
                                                        <option value="">Choisir</option>
                                                        <option value="Conférence">Conférence</option>
                                                        <option value="Formation">Formation</option>
                                                        <option value="Appel à adhésion">Appel à adhésion</option>
                                                        <option value="Webinaire">Webinaire</option>
                                                        <option value="Activité sociale">Activité sociale</option>
                                                    </select>
                                            }
                                            <div className="flex items-start">
                                                <input className="form-check-input mt-1" type="checkbox" onChange={() => setTypeCheck(!typeCheck)} />
                                                <label className="form-check-label ml-2 mr-2 truncate" htmlFor="">Personnaliser le type </label>
                                            </div>
                                        </div>

                                        <div class="mt-4 m-1 flex-1 min-w-[300px]">
                                            <div className='flex justify-between'>
                                                <label className="form-label">Titre <span className='text-red-500'> * </span> </label>
                                                {errors?.title && (<span className='text-red-500'>{errors.title}</span>)}
                                            </div>
                                            <input type="text" onChange={inputHandler} name='title' value={event?.title || ''} className={`form-control`} placeholder="Titre de l'évènement" />
                                        </div>
                                    </div>

                                    <div class="mt-4 m-1">
                                        <label for="" class="form-label">Sous-titre</label>
                                        <textarea type="text" onChange={inputHandler} value={event?.subtitle || ''} name='subtitle' class="form-control" placeholder="Sous-titre de l'évènement" />
                                    </div>


                                    <div class="mt-4 m-1">
                                        <label for="" class="form-label">Date et heure de l'évènement</label>
                                        <div className='flex'>
                                            {/* <input style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} type="date" onChange={inputHandler} value={event?.comingDate.toDate().toLocaleTimeString('fr-FR', {day: '2-digit', month: '2-digit', year: '2-digit'})} name='comingDate' class="form-control" placeholder="" /> */}
                                            <input style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} type="date" onChange={inputHandler} value={event?.comingDate} name='comingDate' class="form-control" placeholder="" />
                                            <input style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} type="time" onChange={inputHandler} value={event?.comingTime} name='comingTime' class="form-control" placeholder="" />
                                        </div>
                                    </div>

                                    <div className="min-w-[300px] mt-4 m-1 flex-1">
                                        <label htmlFor="" className="form-label"> Adresse de l'évènement </label>
                                        <input type='text' onChange={inputHandler} className={`form-control`} value={event?.adress || ''} name='adress' rows="3" placeholder='Adresse' ></input>
                                        <div className="flex mt-4 m-1 items-start">
                                            <input className="form-check-input mt-1" type="checkbox" checked={event?.online || false} name='online' onChange={inputHandler} />
                                            <label className="form-check-label ml-2 mr-2" htmlFor="" >Evènement en ligne  </label>
                                        </div>
                                    </div>

                                    <div class="mt-4 m-1">
                                        <label for="" class="form-label">Lien de l'évènement</label>
                                        <input type="url" onChange={inputHandler} name='link' value={event?.link || ''} class="form-control" placeholder="Lien de l'évènement" />
                                    </div>
                                    <div class="mt-4 m-1">
                                        <label for="" class="form-label">Message associé au lien de l'évènement</label>
                                        <input type="text" onChange={inputHandler} name='linkMessage' value={event?.linkMessage || ''} class="form-control" placeholder="Message associé au lien de l'évènement..." />
                                    </div>


                                    <div class="mt-4 m-1">
                                        <label for="exampleFormControlTextarea1" class="form-label">Descrption de l'évènement</label>
                                        <textarea class="form-control" value={event?.description || ''} name='description' onChange={inputHandler} title='description' id="exampleFormControlTextarea1" rows="10"></textarea>
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

export default UpdateEvent