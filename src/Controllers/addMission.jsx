import React, { useEffect, useState, } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db } from '../auth/firebase';
import missionSchema from '../models/missionModel'
import { addDoc, collection } from 'firebase/firestore';

const AddMission = () => {

    const [mission, setMission] = useState(missionSchema)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setMission({ ...mission, [name]: value })
        console.log(name, value);
    }

    const SubmitForm = async (e) => {
        setLoading(true)
        e.preventDefault()
        await addDoc(collection(db, 'mission'), mission).then((res) => {
            setMessage('Mission enregistrée avec succès !')
            setLoading(false)
            const modalElement = document.getElementById('staticBackdrop');
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            document.body.classList.remove('modal-open');
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            modal.hide();
        }).catch((e) => {
            console.log(e);
            setMessage("Une erreur s'est produite !!")
        })
    }


    return (
        <div>
            <div className='flex justify-between p-3'>
                <h2>Les missions</h2>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <span className="max-[800px]:hidden">Ajouter une mission</span> <i class="fa-solid fa-plus"></i>
                </button>
            </div>

            <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form action="" onSubmit={SubmitForm}>
                            <div class="modal-header">
                                <h1 class="modal-title fs-5">Nouvelle mission</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body max-h-[70vh] overflow-auto">
                                <div class="mb-3">
                                    <label for="" class="form-label">Titre</label>
                                    <input type="text" onChange={inputHandler} required name='title' class="form-control" placeholder="Titre de l'mission" />
                                </div>

                                <div class="mb-3">
                                    <label for="exampleFormControlTextarea1" class="form-label">Descrption de la mission</label>
                                    <textarea class="form-control" required name='description' onChange={inputHandler} title='description' rows="3"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="inputGroupFile02" class="form-label">Image</label>
                                    <input type="file" accept="image/*" title='images' class="form-control" placeholder='Choisir une image' />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                <button type="submit" class="btn btn-primary" disabled={loading}>
                                    <span class={`${loading ? "spinner-border spinner-border-sm" : "hidden"}`} aria-hidden="true"></span>
                                    {loading ? "Chargement..." : "Enregistrer"}
                                </button>
                            </div>
                            <div className={`text-center ${message.includes('succès') ? 'text-green-500' : 'text-red-500'} `}>
                                <span className=''>{message}</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddMission
