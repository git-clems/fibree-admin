import React, { useState, } from 'react'
import axios from 'axios'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../auth/firebase';
import Loading from '../components/LoadingPage';

const AddStatistic = () => {

    const [statistic, setStatistic] = useState()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setStatistic({ ...statistic, [name]: value })
        console.log(name, value);
    }

    const SubmitForm = async (e) => {
        setLoading(true)
        e.preventDefault()
        await addDoc(collection(db, 'statistic'), statistic).then((res) => {
            setMessage('Statistic enregistrée avec succès !')
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
                <h2>Les statistiques</h2>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <span className="max-[800px]:hidden">Ajouter une statistique</span> <i class="fa-solid fa-plus"></i>
                </button>
            </div>

            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form action="" onSubmit={SubmitForm}>
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Nouvelle statistique</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body max-h-[70vh] overflow-auto">
                                
                                <div class="mb-3">
                                    <label for="" class="form-label">Valeur statistique</label>
                                    <input type="number" onChange={inputHandler} required name='value' class="form-control" id="" placeholder="Inserer la valeur statistique..." />
                                </div>

                                <div class="mb-3">
                                    <label for="" class="form-label">Description</label>
                                    <textarea type="text" onChange={inputHandler} required name='description' class="form-control" id="" placeholder="Décrire le statistique..." />
                                </div>

                                <div class="mb-3">
                                    <label for="" class="form-label">Image d'illustration</label>
                                    <input type="file" accept="image/*" title='images' class="form-control" id="" placeholder='Choisir une image d' />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                                <button type="submit" class="btn btn-primary" disabled={loading}>{loading ? "Chargement..." : "Enregistrer"}</button>
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

export default AddStatistic