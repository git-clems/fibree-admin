import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";
import html2pdf from 'html2pdf.js'


const JoinDetailAdmin = () => {
    const [join, setJoin] = useState();
    // const [member, setMember] = useState(memberSchema)
    const { id } = useParams();
    const recapRef = useRef()
    const navigate = useNavigate()

    const AcceptMember = async (joinId) => {
        try {
            const response = await getDocs(collection(db, 'join'))
            const data = response.docs.map(doc => ({
                _id: doc.id,
                ...doc.data()
            }))
            const joinFound = data.find(e => e._id === joinId)
            const { _id, ...rest } = joinFound
            const member = { ...rest, acceptedDate: Timestamp.fromDate(new Date()) }
            updateDoc(doc(db, 'join', joinId), { accepted: true })
                .then(() =>
                    addDoc(collection(db, 'member'), member)
                )
            // console.log(data);

        } catch (error) {
            console.log(error);
        }
    }

    // console.log(member);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDocs(collection(db, 'join'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                const foundJoin = data.find((e) => e._id === id);
                setJoin(foundJoin || null);
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
            filename: `${join.fname}_recap_fibree.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().set(opt).from(element).save()
    }

    while (!join) { return <Loading></Loading> }


    return (
        <div className="page flex justify-center items-center">
            <div className="w-full max-w-[700px] mt-5 mb-5 p-2">
                <div ref={recapRef} style={{ backgroundColor: 'white', borderColor: 'gray' }} className="border overflow-hidden rounded-md">
                    <div style={{ backgroundColor: 'green', color: "white" }} className="p-2 flex justify-between">
                        <div>
                            <i class="fa-solid fa-circle-user"></i><span className="ml-2">{join.gender === 'male' ? <span>M. </span> : <span>Mme. </span>} {join.fname} {join.lname.toUpperCase()}</span> <br />
                            {join.tel && <div><i class="fa-solid fa-phone"></i><span className="ml-2">{join.tel}</span> <br /></div>}
                            Adresse : <span>{join.city}, {join.country}</span>
                        </div>
                        <img src="/logo/logo.png" alt="" className='h-[100px] w-[100px] rounded-md' />
                    </div>

                    <div className="p-2">

                        <div className="mt-1 space-y-3">

                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Email</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{join.email}</span>
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
                        className="btn btn-secondary"
                    >
                        Télécharger en PDF <i class="fa-solid fa-download"></i>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            AcceptMember(join._id)
                            navigate('/admin/nouveau-membre')
                        }}
                        className="btn btn-primary"
                    // disabled = {join.accepted}
                    >
                        {`${join.accepted ? "Déjà accepté" : "Accepter"}`}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default JoinDetailAdmin;