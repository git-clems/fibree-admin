import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";
import html2pdf from 'html2pdf.js'
import Page404 from "../pages/404";


const ContactDetailAdmin = () => {
    const [contact, setContact] = useState();
    const { id } = useParams();
    const recapRef = useRef()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const docSanp = await getDoc(doc(db, 'contact', id))
                if (docSanp.exists()) {
                    setContact({ _id: docSanp.id, ...docSanp.data() } || null);
                } else {
                    setContact(null)
                }
            } catch (error) {
                setContact(null)
            } finally {
                setLoading(false)
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

    if (loading) return <Loading />
    if (!contact) return <Page404 message={'Message non retrouvé'} prev={"Revenir aux messageries"} prevLink={'/admin/messagerie'} />


    return (
        <div className="page flex justify-center">
            <div className="w-full max-w-[700px] m-2">

                <div ref={recapRef} style={{ backgroundColor: 'white', borderColor: 'gray' }} className="border overflow-hidden mt-5 mb-5 rounded-md">
                    <div style={{ backgroundColor: 'green', color: "white" }} className="p-2 flex justify-between">
                        <div>
                            <h5>{contact.object}</h5>
                            <span className="text-sky-100">Expéditeur : {contact.fname} {contact.lname} {`<${contact.email}>`}</span> <br />
                            <span className="text-sky-100">Date : {contact.contactDate?.toDate().toLocaleString('fr-FR')}</span>
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