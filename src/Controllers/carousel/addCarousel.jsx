import { useEffect, useMemo, useState, } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../auth/firebase';
import carouselSchema from '../../models/carouselModel';
import Loading from '../../components/LoadingPage';
import { upload } from '@imagekit/react'
import { authenticator } from '../../auth/imageKit';


const AddCarousel = () => {
    const [open, setOpen] = useState(false)
    const [carousel, setCarousel] = useState(carouselSchema)
    const [initialCarousel, setInitialCarousel] = useState(carouselSchema)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }

    const ErrorHandler = () => {
        const newErrors = {}

        if (!file) {
            newErrors.image = "L'image est obligatoire"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
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
            setCarousel(carouselSchema)
            setErrors({})
            setFile(null)
        }

        return () => document.body.style.overflow = "auto";
    }, [open]);

    const SubmitForm = async (e) => {
        e.preventDefault()
        const isValid = ErrorHandler()
        if (!isValid) return

        setLoading(true)
        try {
            const imageUrl = await uploadImage()

            await addDoc(collection(db, 'carousel'), { ...carousel, image: imageUrl || null, createAt: Timestamp.fromDate(new Date()) })
            setMessage('Carousel enregistrée avec succès !')
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
                <h2>Carousel</h2>
                <button className='btn btn-primary' onClick={() => setOpen(!open)}><span className="max-[800px]:hidden">Ajouter un carousel</span> <i class="fa-solid fa-plus"></i></button>
            </div>
            {
                open &&
                <div className="fixed bg-[rgba(0,0,0,0.5)] flex justify-center h-100 w-100 top-0 pt-0 left-0 z-500 duration-200 transition-transform">
                    <form onSubmit={SubmitForm} className={'bg- border border-gray-200 bg-white max-w-[500px] mt-2 rounded-md flex-col h-[max-content] '}>
                        <div className='border-b border-gray-300 line-clamp-1 font-bold m-2'>Nouveau carousel</div>

                        <div className="max-h-[70vh] overflow-auto mt-4 m-1">
                            <div className="mb-3 m-1">
                                <label for="" className="form-label">Nom</label>
                                <input type="text" onChange={inputHandler} value={carousel?.title || ""} name='title' className="form-control" placeholder="Nom du carousel" />
                            </div>

                            <div className="mb-3 m-1">
                                <div className='flex justify-between'>
                                    <label for="" className="form-label">Images <span className='text-red-500'> * </span></label>
                                    {errors?.image && (<span className='text-red-500'>{errors.image}</span>)}
                                </div>
                                <input type="file" accept="image/*" onChange={handleFile} title='image' className="form-control" placeholder='Choisir une image' />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary m-1" disabled={loading || uploading} onClick={() => { setOpen(false) }}>Annuler</button>
                            <button type="submit" className="btn btn-primary m-1 h-10 w-30 flex justify-center items-center" disabled={loading || uploading}>
                                {
                                    loading || uploading
                                        ? <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                        : "Modifier"
                                }
                            </button>
                        </div>
                        <div className={`text-center ${message.includes('succès') ? 'text-green-500' : 'text-red-500'} `}>{message}</div>
                    </form>
                </div>
            }
        </div>
    )
}

export default AddCarousel
