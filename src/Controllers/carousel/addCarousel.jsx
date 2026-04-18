import { useEffect, useMemo, useState, } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../auth/firebase';
import carouselSchema from '../../models/carouselModel';
import Loading from '../../components/LoadingPage';
import { upload } from '@imagekit/react'


const AddCarousel = () => {
    const [open, setOpen] = useState(false)
    const [carousel, setCarousel] = useState(carouselSchema)
    const [initialCarousel, setInitialCarousel] = useState(carouselSchema)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const [file, setFile] = useState(null)
    const [uploading, setUploading] = useState(false)

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }
    const authenticator = async () => {
        try {
            // Perform the request to the upload authentication endpoint.
            const response = await fetch("http://localhost:3000/auth");
            if (!response.ok) {
                // If the server response is not successful, extract the error text for debugging.
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            // Parse and destructure the response JSON for upload credentials.
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            // Log the original error for debugging before rethrowing a new error.
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

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
        }

        return () => document.body.style.overflow = "auto";
    }, [open]);

    const SubmitForm = async (e) => {
        e.preventDefault()
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
            <div className={`
            ${!open && "hidden"} fixed bg-[rgba(0,0,0,0.5)] 
            flex justify-center
            h-100 w-100 top-0 pt-0 left-0 z-500
            duration-200 transition-transform`
            }>

                <form onSubmit={SubmitForm} className={'bg- border border-gray-200 bg-white max-w-[500px] mt-2 rounded-md flex-col h-[max-content] '}>
                    <div className='border-b border-gray-300 line-clamp-1 font-bold m-2'>Nouveau carousel</div>

                    <div className="max-h-[70vh] overflow-auto mt-4 m-1">
                        <div className="mb-3 m-1">
                            <label for="exampleFormControlInput1" className="form-label">Nom</label>
                            <input type="text" onChange={inputHandler} value={carousel?.title || ""} name='title' className="form-control" id="exampleFormControlInput1" placeholder="Nom du carousel" />
                        </div>

                        <div className="mb-3 m-1">
                            <label for="" className="form-label">Images</label>
                            <input type="file" required accept="image/*" onChange={handleFile} title='image' className="form-control" id="" placeholder='Choisir une image' />
                            {uploading && <div className='text-blue-500'>Image en téléchargement...</div>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary m-1" disabled={loading || uploading} onClick={() => { setOpen(false) }}>Annuler</button>
                        <button type="submit" className="btn btn-primary m-1" disabled={loading || uploading}>{loading ? "Chargement..." : "Ajouter"}</button>
                    </div>
                    <div className={`text-center ${message.includes('succès') ? 'text-green-500' : 'text-red-500'} `}>
                        <span className=''>{message}</span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCarousel
