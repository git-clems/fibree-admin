import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";
import html2pdf from 'html2pdf.js'


const ContactDetailAdmin = () => {
    const [contact, setContact] = useState();
    const { id } = useParams();
    const recapRef = useRef()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDocs(collection(db, 'contact'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                const foundContact = data.find((e) => e._id === id);
                setContact(foundContact || null);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [id]);

    const downloadPDF = () => {
        const element = recapRef.current

        const opt = {
            margin: 20,
            filename: `${contact.fname}_recap_fibree.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().set(opt).from(element).save()
    }

    while (!contact) { return <Loading></Loading> }


    return (
        <div className="page flex justify-center">
            <div className="w-full max-w-[700px] m-2">

                <div ref={recapRef} style={{ backgroundColor: 'white', borderColor: 'gray' }} className="border overflow-hidden mt-5 mb-5 rounded-md">
                    <div style={{ backgroundColor: 'green', color: "white" }} className="p-2 flex justify-between">
                        <div>
                            <h5>{contact.object}</h5>
                            <span>De : {contact.fname} {contact.lname} {`<${contact.email}>`}</span> <br />
                            <span>Date : {contact.contactDate?.toDate().toLocaleString('fr-FR')}</span>
                        </div>
                    </div>

                    <div className="p-2">

                        <div className="mt-1 space-y-3">
                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Tél</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{contact.tel}</span>
                            </div>

                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Adresse</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{contact.city}, {contact.country}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                                <span className="text-1">{contact.message}</span>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="mt-6 flex justify-between">
                    <button
                        type="button"
                        onClick={downloadPDF}
                        className="btn btn-secondary"
                    >
                        Télécharger en PDF <i class="fa-solid fa-download"></i>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setContact(contactSchema)
                            // setSend(false)
                        }}
                        className="btn btn-primary"
                    >
                        Répondre
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ContactDetailAdmin;