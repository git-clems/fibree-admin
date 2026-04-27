import React, { useEffect, useState, } from 'react'
import axios from 'axios'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db } from '../auth/firebase';
import { addDoc, collection } from 'firebase/firestore';
import partenaireSchema from '../models/partenaireModel'

const AddPartenaire = () => {

    const [open, setOpen] = useState(false)
    const [partenaire, setPartenaire] = useState(partenaireSchema)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            setMessage('')
            setPartenaire()
        }

        return () => document.body.style.overflow = "auto";
    }, [open]);

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setPartenaire({ ...partenaire, [name]: value })
    }

    const SubmitForm = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            await addDoc(collection(db, 'partner'), partenaire).then((res) => {
                setMessage('Information enregistré avec succès !')
                setOpen(false)
                setPartenaire()
            })

        } catch (error) {
            console.log(e);
            setMessage("Une erreur s'est produite !!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-2 rounded-t-md '>
            <div className='flex justify-between'>
                <h2>Partenaires</h2>
                <button className='btn btn-primary' onClick={() => setOpen(!open)}><span className="max-[800px]:hidden">Ajouter une partenaire</span> <i class="fa-solid fa-plus"></i></button>
            </div>
            <div className={`
            ${open ? "block" : "hidden"} fixed bg-[rgba(0,0,0,0.5)] 
            flex justify-center
            h-100 w-100 top-0 pt-0 left-0 z-500
            duration-200 transition-transform`
            }>

                <form onSubmit={SubmitForm} className={'bg-white border border-gray-200 p-2 mt-2 rounded-md flex-col h-[max-content] '}>
                    <h1 class="border-b border-gray-300">Nouveau partenaire</h1>

                    <div class="max-h-[70vh] overflow-auto mt-4">
                        <div class="mb-3">
                            <label for="" class="form-label">Nom</label>
                            <input type="text" onChange={inputHandler} required name='name' class="form-control" placeholder="Nom du partenaire" />
                        </div>

                        <div class="mb-3">
                            <label for="inputGroupFile02" class="form-label">Images</label>
                            <input type="file" accept="image/*" title='images' class="form-control" placeholder='Choisir une image' />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary m-1" onClick={() => { setOpen(false) }}>Annuler</button>
                        <button type="submit" class="btn btn-primary m-1" disabled={loading}>{loading ? "Chargement..." : "Enregistrer"}</button>
                    </div>
                    <div className={`text-center ${message.includes('succès') ? 'text-green-500' : 'text-red-500'} `}>
                        <span className=''>{message}</span>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddPartenaire