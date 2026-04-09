import React, { useState, useRef } from 'react'
import ContrySelector from '../components/countrySection'
import Loading from '../components/LoadingPage'
import contactSchema from '../models/contactModel'
import html2pdf from 'html2pdf.js'
import { addDoc, collection, doc } from 'firebase/firestore'
import { db } from '../auth/firebase'
import { useNavigate } from 'react-router'

const Contact = () => {
  const recapRef = useRef()

  const [contact, setContact] = useState(contactSchema)
  const [loading, setLoading] = useState(false)
  const [send, setSend] = useState(false)
  const [objectCheck, setObjectCheck] = useState(false)

  const inputHandler = (e) => {
    const { name, value } = e.target
    setContact({ ...contact, [name]: value })
    // console.log(name, value);
  }

  const naviagate = useNavigate()

  const HandleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await addDoc(collection(db, 'contact'), contact)
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
      filename: `${contact.fname}_recap_fibree.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(element).save()
  }

  const FormRecap = () => {
    return (
      <div className="page flex justify-center">
        <div className="w-full max-w-[700px] mt-5 mb-5">
          <div ref={recapRef} style={{ backgroundColor: 'white', borderColor: 'gray' }} className="w-full max-w-[700px] border overflow-hidden rounded-md">
            <div style={{ backgroundColor: 'green', color: "white" }} className="p-3 flex justify-between">
              <div>
                <h3>Message envoyé</h3>
                <p className="mt-1 opacity-90">
                  Votre message a bien été transmis.
                </p>
              </div>
              <img src="/logo/logo.png" alt="" className='h-[100px] w-[100px] rounded-md' />
            </div>

            <div className="p-2">
              <div className="flex justify-between items-start flex-wrap gap-4 pb-4">
                <div>
                  <h4>Résumé de votre message</h4>
                  <p style={{ color: "rgba(0,0,0,0.4)" }} >Merci pour votre intérêt envers la FIBREE.</p>
                </div>
                {/* <p style={{ color: "rgba(0,0,0,0.3)" }} ><span className="font-semibold">Statut :</span> Envoyée</p> */}
              </div>

              <div className="mt-1 space-y-3">
                <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                  <span className="font-semibold">Nom complet</span>
                  <span style={{ color: "rgba(0, 0, 0, 0.56)" }} >{contact.fname} {contact.lname}</span>
                </div>

                <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                  <span className="font-semibold">Email</span>
                  <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{contact.email}</span>
                </div>

                <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                  <span className="font-semibold">Téléphone</span>
                  <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{contact.tel}</span>
                </div>
              </div>

              <div className="mt-6">
                <h5 className="font-semibold mb-2">Objet</h5>
                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                  {contact.object}
                </div>
              </div>

              <div className="mt-4">
                <h5 className="font-semibold mb-2">Votre message</h5>
                <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                  {contact.message}
                </div>
              </div>

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
                // setContact(contactSchema)
                // setSend(false)
                // nav
                naviagate('/')
              }}
              className="btn btn-primary m-2"
            >
              Revenir à l'accueil
            </button>
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
        <h5 className="ml-3 mr-3">Vous souhaitez nous contacter ?</h5>

        <p className='ml-3 mb-3'>Les champs marqué par <span className='text-red-500'> * </span> sont obligatoires.</p>
        <form action="" className='min-[800px]:border-3 border-gray-300 rounded-md p-4 pt-0 bg-gray-100' onSubmit={HandleSubmit}>
          <div className="flex mb-3 justify-between flex-wrap">
            <div className="min-w-[300px] m-1 mt-3 flex-1">
              <label htmlFor="" className="form-label">Nom <span className='text-red-500'> * </span>  </label>
              <input type="text" onChange={inputHandler} className="form-control" name='fname' required id="nom" />
            </div>

            <div className="min-w-[300px] m-1 mt-3 flex-1">
              <label htmlFor="" className="form-label">Prénom(s) <span className='text-red-500'> * </span>  </label>
              <input type="text" onChange={inputHandler} className="form-control" name='lname' required id="prenom" />
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
            <label htmlFor="" className="form-label">Objet <span className='text-red-500'> * </span>  </label>
            {!objectCheck ?
              <select class="form-select" autocomplete="object" id="object" onChange={inputHandler} required name="object">
                <option value="">Choisir un objet</option>
                <option value="Renseignement">Renseignement</option>
                <option value="Partenariat">Partenariat</option>
                <option value="Devenir membre">Devenir membre</option>
                <option value="Aider la FIBREE">Aider la FIBREE</option>
              </select> :
              <input type="text" onChange={inputHandler} className="form-control" id="object" name='object' placeholder="Inserez l'objet de votre message" required />
            }
            <div className="flex m-1 mt-3 items-start">
              <input className="form-check-input mt-1" type="checkbox" id="checkDefault" onChange={() => setObjectCheck(!objectCheck)} />
              <label className="form-check-label ml-2 mr-2" htmlFor="" >Un autre objet de discussion ?  </label>
            </div>
          </div>

          <div className="min-w-[300px] m-1 mt-3 flex-1">
            <label htmlFor="" className="form-label">Votre message <span className='text-red-500'> * </span>  </label>
            <textarea onChange={inputHandler} className="form-control" id="message" name='message' rows="3" placeholder='Rédiger ici votre message' required></textarea>
          </div>


          <div className="flex m-1 mt-3 items-start">
            <input className="form-check-input mt-1" type="checkbox" id="checkDefault" required />
            <label className="form-check-label ml-2 mr-2" htmlFor="" name='ugc' onChange={inputHandler}>En cochant cette case, je suis d'accord avec les conditions d'utilisation de la FIBREE <span className='text-red-500'> * </span>  </label>
          </div>
          <div className='flex justify-center m-1 mt-3'>
            <button type="submit" class="btn btn-primary" >{"Envoyer"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact