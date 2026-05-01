import React, { useEffect, useState, } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db } from '../../auth/firebase';
import { addDoc, collection, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import partnerSchema from '../../models/partnerModel'
import { authenticator } from '../../auth/imageKit'
import { upload } from '@imagekit/javascript';
import Loading from '../../components/LoadingPage';

const UpdatePartner = ({ partnerId }) => {

    const [partner, setPartner] = useState(null)
    const [initialPartner, setInitialPartner] = useState(null)
    const [typeCheck, setTypeCheck] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState({})


    useEffect(() => {
        if (!open) return
        const fetchData = async () => {
            try {
                const snap = await getDoc(doc(db, 'partner', partnerId))
                if (snap.exists()) {
                    setPartner({ _id: snap.id, ...snap.data() })
                    setInitialPartner({ _id: snap.id, ...snap.data() })
                } else {
                    setPartner(null)
                }
            } catch (error) {
                setPartner(null)
            }
        }

        fetchData()
    }, [open, partnerId])


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
                folder: "/partner",
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
        setPartner({
            ...partner, [name]:
                type === "checkbox"
                    ? checked
                    : value
        })
    }

    const ErrorHandler = () => {
        const newErrors = {}
        if (!partner.name?.trim()) {
            newErrors.name = 'Le nom est obligatoire'
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

            await updateDoc(doc(db, 'partner', partnerId), {
                ...partner,
                image: imageUrl || initialPartner.image,
                updateAt: Timestamp.fromDate(new Date())
            })

            setMessage('Partenaire modifié avec succès !')
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
                        !partner
                            ? <Loading></Loading>
                            : <form onSubmit={SubmitForm} className={'bg-gray-100 m-2 rounded-md flex-col h-[max-content] min-[600px]:w-[60%]'}>

                                <div class="flex justify-between rounded-t-md shadow-[0_0_5px_rgba(0,0,0,0.2)] overflow-hidden p-2">
                                    <span class="text-xl font-bold" id="">{initialPartner.name}</span>
                                    <button disabled={loading || uploading} type="button" class="btn-close" onClick={() => setOpen(!open)}></button>
                                </div>
                                <div class="m-2 p-2 max-h-[70vh] overflow-auto">

                                    <div className='flex justify-between flex-wrap'>

                                        <div class="mt-4 m-1 flex-1 min-w-[300px]">
                                            <div className='flex justify-between'>
                                                <label className="form-label">Nom <span className='text-red-500'> * </span> </label>
                                                {errors?.name && (<span className='text-red-500'>{errors.name}</span>)}
                                            </div>
                                            <input type="text" onChange={inputHandler} name='name' value={partner?.name || ''} className={`form-control`} placeholder="Nom du partenaire" />
                                        </div>
                                    </div>

                                    <div class="mt-4 m-1">
                                        <label class="form-label">Image d'illustration</label>
                                        <input type="file" accept="image/*" onChange={handleFile} class="form-control" placeholder='Choisir une image' />
                                    </div>
                                </div>

                                <div className='shadow-[0_0_5px_rgba(0,0,0,0.2)] p-2'>
                                    <div class="flex justify-between">
                                        <button type="button" className="btn btn-secondary" disabled={loading || uploading} onClick={() => { setOpen(false) }}>Annuler</button>
                                        <button type="submit" className="btn btn-primary" disabled={loading || uploading}>{loading || uploading ? "Chargement..." : "Modifier"}</button>
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

export default UpdatePartner