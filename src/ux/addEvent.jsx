import React, { useState, } from 'react'
import axios from 'axios'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { db } from '../auth/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import eventSchema from '../models/eventModel'

const AddEvent = () => {


    const [event, setEvent] = useState(eventSchema)
    const [typeCheck, setTypeCheck] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const inputHandler = (e) => {
        const { name, value, type, checked } = e.target;
        setEvent({
            ...event, [name]:
                name === 'comingDate'
                    ? Timestamp.fromDate(new Date(value))
                    : type === "checkbox"
                        ? checked
                        : value
        })
    }

    const SubmitForm = async (e) => {
        setLoading(true)
        e.preventDefault()
        await addDoc(collection(db, 'event'), event).then((res) => {
            setMessage('Information enregistré avec succès !')
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
                <h2>Evènements</h2>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <span className="max-[800px]:hidden">Ajouter une évènement</span> <i class="fa-solid fa-plus"></i>
                </button>
            </div>

            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <form action="" onSubmit={SubmitForm}>

                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="staticBackdropLabel">Nouvel évènement</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body max-h-[70vh] overflow-auto">

                                <div className="min-w-[300px] m-1 mt-3 flex-1">
                                    <label htmlFor="" className="form-label"> Type d'évènement<span className='text-red-500'> * </span>  </label>
                                    {
                                        typeCheck ?
                                            <input type='text' onChange={inputHandler} className="form-control" id="type" name='type' rows="3" placeholder="Personnalisez le type de l'évènement" required></input> :
                                            <select class="form-select" autocomplete="type" id="type" onChange={inputHandler} required name="type">
                                                <option value="">Choisir</option>
                                                <option value="Conférence">Conférence</option>
                                                <option value="Formation">Formation</option>
                                                <option value="Appel à adhésion">Appel à adhésion</option>
                                                <option value="Webinaire">Webinaire</option>
                                                <option value="Activité sociale">Activité sociale</option>
                                            </select>
                                    }
                                    <div className="flex m-1 mt-3 items-start">
                                        <input className="form-check-input mt-1" type="checkbox" id="" name='type' onChange={() => setTypeCheck(!typeCheck)} />
                                        <label className="form-check-label ml-2 mr-2" htmlFor="">Personnaliser  </label>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="" class="form-label">Titre <span className='text-red-500'> * </span> </label>
                                    <input type="text" onChange={inputHandler} required name='title' class="form-control" id="" placeholder="Titre de l'info" />
                                </div>

                                <div class="mb-3">
                                    <label for="" class="form-label">Sous-titre</label>
                                    <input type="text" onChange={inputHandler} name='subtitle' class="form-control" id="" placeholder="Sous-titre de l'info" />
                                </div>


                                <div class="mb-3 mt-3">
                                    <label for="" class="form-label">Date de l'évènement et heure de l'évènement</label>
                                    <div className='flex'>
                                        <input style={{borderTopRightRadius : 0, borderBottomRightRadius : 0}} type="date" onChange={inputHandler} name='comingDate' class="form-control" id="" placeholder="" />
                                        <input style={{borderTopLeftRadius : 0, borderBottomLeftRadius : 0}} type="time" onChange={inputHandler} name='comingTime' class="form-control" id="" placeholder="" />
                                    </div>
                                </div>

                                <div className="min-w-[300px] m-1 mt-3 flex-1">
                                    <label htmlFor="" className="form-label"> Adresse de l'évènement </label>
                                    <input type='text' onChange={inputHandler} className={`form-control`} id="adress" name='adress' rows="3" placeholder='Adresse' disabled={event.online}></input>
                                    <div className="flex m-1 mt-3 items-start">
                                        <input className="form-check-input mt-1" type="checkbox" id="" name='online' onChange={inputHandler} />
                                        <label className="form-check-label ml-2 mr-2" htmlFor="" >Evènement en ligne  </label>
                                    </div>
                                </div>

                                <div class="mb-3 mt-3">
                                    <label for="" class="form-label">Lien de l'info</label>
                                    <input type="url" onChange={inputHandler} name='externalLink' class="form-control" id="" placeholder="Lien de l'info" />
                                </div>


                                <div class="mb-3">
                                    <label for="exampleFormControlTextarea1" class="form-label">Descrption de l'évènement</label>
                                    <textarea class="form-control" name='description' onChange={inputHandler} title='description' id="exampleFormControlTextarea1" rows="3"></textarea>
                                </div>



                                <div class="mb-3">
                                    <label for="inputGroupFile02" class="form-label">Image</label>
                                    <input type="file" accept="image/*" title='image' class="form-control" id="inputGroupFile02" placeholder='Choisir une image' />
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

export default AddEvent