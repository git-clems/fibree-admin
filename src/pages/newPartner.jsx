import { useState, useRef } from 'react'
import ContrySelector from '../components/countrySection'
import Loading from '../components/LoadingPage'
import newPartner from "../models/newPartnerModel"
import html2pdf from 'html2pdf.js'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '../auth/firebase'

const BePartner = () => {
    const recapRef = useRef()

    const [partner, setPartner] = useState(newPartner)
    const [loading, setLoading] = useState(false)
    const [send, setSend] = useState(false)
    const [objectCheck, setObjectCheck] = useState(false)
    const [errors, setErrors] = useState({})

    const inputHandler = (e) => {
        const { name, value } = e.target
        setPartner({ ...partner, [name]: value })
    }

    const HandleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            addDoc(collection(db, 'new-partner'), { ...partner, sendDate: Timestamp.fromDate(new Date()) })
            setLoading(false)
            setSend(true)
        } catch (error) {
            setSend(false)
            console.log(error);
        }
    }

    const downloadPDF = () => {
        const element = recapRef.current

        const opt = {
            margin: 10,
            filename: `recap_fibree.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().set(opt).from(element).save()
    }

    const FormRecap = () => {
        return (
            <div className="page flex justify-center items-center">
                <div ref={recapRef} style={{ backgroundColor: 'white', borderColor: 'gray' }} className="w-full max-w-[700px] border overflow-hidden mt-5 mb-5 rounded-md">
                    <div style={{ backgroundColor: 'green', color: "white" }} className="p-2 flex justify-between">
                        <div>
                            <h3>Demande envoyée</h3>
                            <p className="mt-1 opacity-90">
                                Votre demande de partenariat a bien été transmise.
                            </p>
                        </div>
                        <img src="/logo/logo.png" alt="" className='h-[100px] w-[100px] rounded-md' />
                    </div>

                    <div className="p-6 max-[800px]:p-3">
                        <div className="flex justify-between items-start flex-wrap gap-2 pb-2">
                            <p style={{ color: "rgba(0,0,0,0.4)" }} >Merci pour votre intérêt envers la FIBREE.</p>
                            <h4>Résumé de votre requète</h4>
                        </div>

                        <div className="mt-1 space-y-3">
                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Nom</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }} >{partner.name}</span>
                            </div>

                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Email</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{partner.email}</span>
                            </div>

                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Téléphone</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{partner.tel}</span>
                            </div>

                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Adresse</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{partner.city}, {partner.country}</span>
                            </div>

                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Profession</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{partner.profession}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h5 className="font-semibold mb-2">Motivation</h5>
                            <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                                {partner.motivation}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h5 className="font-semibold mb-2">Ce que vous souhaitez apporter</h5>
                            <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                                {partner.contribution}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h5 className="font-semibold mb-2">Ce que vous espérez recevoir</h5>
                            <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                                {partner.expectation}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between">
                            <button
                                type="button"
                                onClick={downloadPDF}
                                className="btn btn-secondary m-2"
                            >
                                Télécharger en PDF <i class="fa-solid fa-download"></i>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setPartner(newPartner)
                                    setSend(false)
                                }}
                                className="btn btn-primary m-2"
                            >
                                Nouvelle demande
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    if (send) { return <FormRecap></FormRecap> }

    if (loading) { return <Loading></Loading> }

    return (
        <div className="page flex justify-center">
            <div className="max-w-[800px] mb-5 mt-5">
                <h5 className="ml-3 mr-3">Vous souhaitez relever les défis d'ordre entreprenarial avec la FIBREE, devenez partenaire.</h5>

                <p className='ml-3 mb-3'>Les champs marqué par <span className='text-red-500'> * </span> sont obligatoires.</p>
                <form action="" className='min-[800px]:border-3 border-gray-300 rounded-md p-2 pt-0 bg-gray-100' onSubmit={HandleSubmit}>

                    <div className="min-w-[300px] m-1 mt-3 flex-1">
                        <label htmlFor="" className="form-label"><sup>1</sup> Qui ête-vous ?<span className='text-red-500'> * </span>  </label>
                        {
                            objectCheck ?
                                <input type='text' onChange={inputHandler} className="form-control" id="profession" name='profession' rows="6" placeholder='Dites nous qui vous êtes' required></input> :
                                <select class="form-select" autocomplete="profession" id="profession" onChange={inputHandler} required name="profession">
                                    <option value="">Choisir</option>
                                    <option value="Entreprise">Entreprise</option>
                                    <option value="Organisation non gouvernementale">Organisation non gouvernementale</option>
                                    <option value="Structure gouvernementale">Structure gouvernementale</option>
                                    <option value="Un particulier">Un particulier</option>
                                </select>
                        }
                        <div className="flex m-1 mt-3 items-start">
                            <input className="form-check-input mt-1" type="checkbox" id="checkDefault" name='profession' onChange={() => setObjectCheck(!objectCheck)} />
                            <label className="form-check-label ml-2 mr-2" htmlFor="">Personnaliser votre choix <span className='text-red-500'> * </span>  </label>
                        </div>
                    </div>

                    <div className="flex mb-3 justify-between flex-wrap">
                        <div className="min-w-[300px] m-1 mt-3 flex-1">
                            <label htmlFor="" className="form-label">Nom <span className='text-red-500'> * </span>  </label>
                            <input type="text" onChange={inputHandler} className="form-control" name='name' required id="nom" />
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

                    <div className="flex mb-3 justify-between flex-wrap">
                        <div className="min-w-[300px] m-1 mt-3 flex-1">
                            <label htmlFor="" className="form-label">Pays  <span className='text-red-500'> * </span>  </label>
                            <select class="form-select" autocomplete="country" id="country" onChange={inputHandler} required name="country">
                                <ContrySelector></ContrySelector>
                            </select>
                        </div>

                        <div className="min-w-[300px] m-1 mt-3 flex-1">
                            <label htmlFor="" className="form-label">Ville  <span className='text-red-500'> * </span>  </label>
                            <input type="text" onChange={inputHandler} className="form-control" id="city" name='city' required />
                        </div>
                    </div>


                    <div className="min-w-[300px] m-1 mt-3 flex-1">
                        <label htmlFor="" className="form-label">Votre motivation <span className='text-red-500'> * </span>  </label>
                        <textarea onChange={inputHandler} className="form-control" id="motivation" name='motivation' rows="6" placeholder='Rédiger ici une motivation bien explicite' required></textarea>
                    </div>

                    <div className="min-w-[300px] m-1 mt-3 flex-1">
                        <label htmlFor="" className="form-label">Que comptez-vous apporter à la FIBREE ? <span className='text-red-500'> * </span>  </label>
                        <textarea onChange={inputHandler} className="form-control" id="add" rows="6" name='contribution' placeholder='' required></textarea>
                    </div>

                    <div className="min-w-[300px] m-1 mt-3 flex-1">
                        <label htmlFor="" className="form-label">Qu'espérez vous avoir avec la FIBREE ? <span className='text-red-500'> * </span>  </label>
                        <textarea onChange={inputHandler} className="form-control" id="add" rows="6" name='expectation' placeholder='' required></textarea>
                    </div>

                    <div className="flex m-1 mt-3 items-start">
                        <input className="form-check-input mt-1" type="checkbox" id="checkDefault" required />
                        <label className="form-check-label ml-2 mr-2" htmlFor="" name='ugc'>En cochant cette case, je suis d'accord avec les conditions d'utilisation de la FIBREE <span className='text-red-500'> * </span>  </label>
                    </div>
                    <div className='flex justify-center m-1 mt-3'>
                        <button type="submit" class="btn btn-primary" >{"Soumettre"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BePartner