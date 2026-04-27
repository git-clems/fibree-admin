import React, { useState, useRef } from 'react'
import ContrySelector from '../components/countrySection'
import axios from 'axios'
import Loading from '../components/LoadingPage'

import html2pdf from 'html2pdf.js'
import joinSchema from '../models/joinModel'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../auth/firebase'

const JoinUs = () => {
    const recapRef = useRef()

    const [join, setJoin] = useState(joinSchema)
    const [loading, setLoading] = useState(false)
    const [send, setSend] = useState(false)

    const inputHandler = (e) => {
        const { name, value } = e.target
        setJoin({ ...join, [name]: value })
    }

    const HandleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await addDoc(collection(db, 'join'), join)
            .then((res) => {
                setLoading(false)
                setSend(true)
            }).catch((res) => {
                setSend(false)
            })
    }

    const downloadPDF = () => {
        const element = recapRef.current

        const opt = {
            margin: 10,
            filename: `${join.fname}_recap_fibree.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().set(opt).from(element).save()
    }

    const FormRecap = () => {
        return (
            <div className="page flex justify-center items-center">
                <div className='w-full max-w-[700px] mt-5 mb-5'>
                    <div ref={recapRef} style={{ backgroundColor: 'white', borderColor: 'gray' }} className="border overflow-hidden rounded-md">
                        <div style={{ backgroundColor: 'green', color: "white" }} className="p-2 flex justify-between">
                            <div>
                                <h3>Demande envoyée</h3>
                                <p className="mt-1 opacity-90">
                                    Votre demande d'adhésion a bien été transmise.
                                </p>
                            </div>
                            <img src="/logo/logo.png" alt="" className='h-[100px] w-[100px] rounded-md' />
                        </div>

                        <div className="p-3">
                            <div className="flex justify-between items-start flex-wrap gap-2 pb-">
                                <div>
                                    <h4>Résumé de votre candidature</h4>
                                    <p style={{ color: "rgba(0,0,0,0.4)" }} >Merci pour votre intérêt envers la FIBREE.</p>
                                </div>
                                <p style={{ color: "rgba(0,0,0,0.3)" }} ><span className="font-semibold">Statut :</span> Envoyée</p>
                            </div>

                            <div className="mt-1 space-y-3">
                                <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                    <span className="font-semibold">Nom</span>
                                    <span style={{ color: "rgba(0, 0, 0, 0.56)" }} >{join.lname}</span>
                                </div>

                                <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                    <span className="font-semibold">Prénom(s)</span>
                                    <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{join.fname}</span>
                                </div>

                                <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                    <span className="font-semibold">Email</span>
                                    <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{join.email}</span>
                                </div>

                                <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                    <span className="font-semibold">Téléphone</span>
                                    <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{join.tel}</span>
                                </div>

                                <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                    <span className="font-semibold">Adresse</span>
                                    <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{join.city}, {join.country}</span>
                                </div>

                                <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                    <span className="font-semibold">Profession</span>
                                    <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{join.profession}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h5 className="font-semibold mb-2">Motivation</h5>
                                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                                    {join.motivation}
                                </div>
                            </div>

                            <div className="mt-4">
                                <h5 className="font-semibold mb-2">Ce que vous souhaitez apporter</h5>
                                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                                    {join.contribution}
                                </div>
                            </div>

                            <div className="mt-4">
                                <h5 className="font-semibold mb-2">Ce que vous espérez recevoir</h5>
                                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                                    {join.expectation}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                        <button
                            type="button"
                            onClick={downloadPDF}
                            className="btn btn-secondary m-1"
                        >
                            Télécharger en PDF <i class="fa-solid fa-download"></i>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setJoin(joinSchema)
                                setSend(false)
                            }}
                            className="btn btn-primary m-1"
                        >
                            Nouvelle demande
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    console.log(join.ugc);
    const AcceptConditions = async () => {
        try {
            // const updatedValue = !currentValue;
            await updateDoc(doc(db, 'infos', infoId), {
                guc: true,
            });

            setJoin(prev => ({
                guc: true,
                ...prev
            }));
        } catch (error) {
            console.log(error);
        }
    };


    if (send) { return <FormRecap></FormRecap> }

    if (loading) { return <Loading></Loading> }

    return (
        <div className="page flex justify-center">
            <div className="max-w-[800px] mb-5 mt-1">
                <h5 className="ml-3 mr-3">Vous souhaitez faire partie de la fédération ? Vous avez des idées à développer ? Veuillez remplir ce formulaire.</h5>

                <p className='ml-3 mb-3'>Les champs marqué par <span className='text-red-500'> * </span> sont obligatoires.</p>
                <form  className='min-[800px]:border-3 border-gray-300 rounded-md p-2 pt-0 bg-gray-100' onSubmit={HandleSubmit}>
                    <div className="flex mb-3 justify-between flex-wrap">
                        <div className="min-w-[300px] m-1 mt-3 flex-1">
                            <label htmlFor="" className="form-label">Nom <span className='text-red-500'> * </span>  </label>
                            <input type="text" onChange={inputHandler} className="form-control" name='lname' required id="nom" />
                        </div>

                        <div className="min-w-[300px] m-1 mt-3 flex-1">
                            <label htmlFor="" className="form-label">Prénom(s) <span className='text-red-500'> * </span>  </label>
                            <input type="text" onChange={inputHandler} className="form-control" name='fname' required id="prenom" />
                        </div>
                    </div>

                    <div className="flex mb-3 justify-between flex-wrap">
                        <div className="min-w-[300px] m-1 mt-3 flex-1">
                            <label htmlFor="" className="form-label">Email <span className='text-red-500'> * </span>  </label>
                            <input type="email" onChange={inputHandler} className="form-control" id="email" name='email' placeholder="exemple@gmail.com" required />
                        </div>

                        <div className="min-w-[300px] m-1 mt-3 flex-1">
                            <label htmlFor="" className="form-label">Numéro de téléphone <span className='text-red-500'> * </span>  </label>
                            <input type="tel" onChange={inputHandler} className="form-control" id="telephone" name='tel' placeholder="+123 11 22 33 44" required />
                        </div>
                    </div>


                    <div className="min-w-[300px] m-1 mt-3 flex-1">
                        <label htmlFor="" className="form-label">Genre <span className='text-red-500'> * </span>  </label>
                        <select class="form-select" autocomplete="gender" id="gender" onChange={inputHandler} required name="gender">
                            <option value="">Choisir</option>
                            <option value="M.">M.</option>
                            <option value="Mme.">Mme.</option>
                            <option value="Mlle.">Mlle.</option>
                        </select>
                    </div>

                    <div className="flex mb-3 justify-between flex-wrap">
                        <div className="min-w-[300px] m-1 mt-3 flex-1">
                            <label htmlFor="" className="form-label">Pays de résidence <span className='text-red-500'> * </span>  </label>
                            <select class="form-select" autocomplete="country" id="country" onChange={inputHandler} required name="country">
                                <ContrySelector></ContrySelector>
                            </select>
                        </div>

                        <div className="min-w-[300px] m-1 mt-3 flex-1">
                            <label htmlFor="" className="form-label">Ville de résidence <span className='text-red-500'> * </span>  </label>
                            <input type="text" onChange={inputHandler} className="form-control" id="city" name='city' required />
                        </div>
                    </div>


                    <div className="min-w-[300px] m-1 mt-3 flex-1">
                        <label htmlFor="" className="form-label">Votre profession actuelle <span className='text-red-500'> * </span>  </label>
                        <input type='text' onChange={inputHandler} className="form-control" id="profession" name='profession' rows="3" placeholder='Votre profession' required></input>
                    </div>

                    <div className="min-w-[300px] m-1 mt-3 flex-1">
                        <label htmlFor="" className="form-label">Votre motivation <span className='text-red-500'> * </span>  </label>
                        <textarea onChange={inputHandler} className="form-control" id="motivation" name='motivation' rows="3" placeholder='Rédiger ici une motivation bien explicite' required></textarea>
                    </div>

                    <div className="min-w-[300px] m-1 mt-3 flex-1">
                        <label htmlFor="" className="form-label">Vos éventuelles contribution <span className='text-red-500'> * </span>  </label>
                        <textarea onChange={inputHandler} className="form-control" id="add" rows="3" name='contribution' placeholder='' required></textarea>
                    </div>

                    <div className="min-w-[300px] m-1 mt-3 flex-1">
                        <label htmlFor="" className="form-label">Qu'espérez vous apprendre avec la FIBREE ? <span className='text-red-500'> * </span>  </label>
                        <textarea onChange={inputHandler} className="form-control" id="add" rows="3" name='expectation' placeholder='' required></textarea>
                    </div>

                    <div className="flex m-1 mt-3 items-start">
                        <input className="form-check-input mt-1" type="checkbox" id="checkDefault" required />
                        <label className="form-check-label ml-2 mr-2" htmlFor="" name='ugc' onChange={AcceptConditions}> Je ne suis pas un robot <span className='text-red-500'> * </span>  </label>
                    </div>
                    <div className='flex justify-center m-1 mt-3'>
                        <button type="submit" class="btn btn-primary" >{"Soumettre sa candidature"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JoinUs