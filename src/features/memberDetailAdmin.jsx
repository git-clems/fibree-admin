import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";
import html2pdf from 'html2pdf.js'


const MemberDetailAdmin = () => {
    const [member, setMember] = useState();
    const { id } = useParams();
    const recapRef = useRef()

    const AcceptMember = async (memberId) => {
        try {
            const response = await getDocs(collection(db, 'member'))
            const data = response.docs.map(doc => ({
                _id: doc.id,
                ...doc.data()
            }))
            const memberFound = data.find(e => e._id === memberId)
            const { memberDate, ...rest } = memberFound
            const member = {...rest, acceptDate : new Date()}
            addDoc(collection(db, 'member'), memberFound)
            // console.log(data);
            
        } catch (error) {
            console.log(error);
        }
    }

    // console.log(member);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDocs(collection(db, 'member'))
                const data = response.docs.map((doc) => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                const foundMember = data.find((e) => e._id === id);
                setMember(foundMember || null);
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
            filename: `${member.fname}_recap_fibree.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().set(opt).from(element).save()
    }

    while (!member) { return <Loading></Loading> }


    return (
        <div className="page flex justify-center">
            <div className="w-full max-w-[700px] mt-5 mb-5 p-2">
                <div ref={recapRef} style={{ backgroundColor: 'white', borderColor: 'gray' }} className="border overflow-hidden rounded-md">
                    <div style={{ backgroundColor: 'green', color: "white" }} className="p-2 flex justify-between">
                        <div>
                            <i class="fa-solid fa-circle-user"></i><span className="ml-2">{member.fname} {member.lname.toUpperCase()}</span> <br />
                            {member.tel && <div><i class="fa-solid fa-phone"></i><span className="ml-2">{member.tel}</span> <br /></div>}
                            Adresse : <span>{member.city}, {member.country}</span>
                        </div>
                        <img src="/logo/logo.png" alt="" className='h-[100px] w-[100px] rounded-md' />
                    </div>

                    <div className="p-2">

                        <div className="mt-1 space-y-3">

                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Email</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{member.email}</span>
                            </div>

                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Adresse</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{member.city}, {member.country}</span>
                            </div>

                            <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                                <span className="font-semibold">Profession</span>
                                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{member.profession}</span>
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
                        onClick={() => AcceptMember(member._id)}
                        className="btn btn-primary"
                    >
                        Accepter
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MemberDetailAdmin;