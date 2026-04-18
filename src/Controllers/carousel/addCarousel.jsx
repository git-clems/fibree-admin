import React, { useEffect, useMemo, useState, } from 'react'
import axios from 'axios'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../auth/firebase';
import carouselSchema from '../../models/carouselModel';
import Loading from '../../components/LoadingPage';

const AddCarousel = () => {
    const [open, setOpen] = useState(false)
    const [carousel, setCarousel] = useState(carouselSchema)
    const [initialCarousel, setInitialCarousel] = useState(carouselSchema)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

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
        setLoading(true)
        e.preventDefault()
        try {
            await addDoc(collection(db, 'carousel'), carousel)
            setMessage('Carousel enregistrée avec succès !')
            setOpen(false)
        } catch (error) {
            setMessage("Une erreur s'est produite !!")
        } finally {
            setLoading(false)
        }
    }

    
    const isTitled = useMemo(()=>{
        if (!initialCarousel || !carousel) return false
        return carousel.title?.trim() !== ''
    }, [initialCarousel, carousel])

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
                            <input type="text" onChange={inputHandler} value={carousel?.title || ""} required name='title' className="form-control" id="exampleFormControlInput1" placeholder="Nom du carousel" />
                        </div>

                        <div className="mb-3 m-1">
                            <label for="inputGroupFile02" className="form-label">Images</label>
                            <input type="file" accept="image/*" title='image' className="form-control" id="inputGroupFile02" placeholder='Choisir une image' />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary m-1" onClick={() => { setOpen(false) }}>Annuler</button>
                        <button type="submit" className="btn btn-primary m-1" disabled={!isTitled || loading}>{loading ? "Chargement..." : "Ajouter"}</button>
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
