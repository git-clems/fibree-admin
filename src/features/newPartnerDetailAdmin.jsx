import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import Loading from "../components/LoadingPage";
import html2pdf from 'html2pdf.js'
import Page404 from "../pages/404";
import { PublishTime } from "./admin";


const newPartnerDetailAdmin = () => {
  const [newPartner, setnewPartner] = useState();
  const [loading, setLoading] = useState(false)
  const { id } = useParams();
  const recapRef = useRef()
  const navigate = useNavigate()

  const AcceptPartner = async (newPartnerId) => {
    try {
      setLoading(true)
      const data = await getDoc(doc(db, 'new-partner', newPartnerId))
      const newPartnerFound = { _di: data.id, ...data.data() }
      const { _id, ...rest } = newPartnerFound
      const member = { ...rest, acceptedDate: Timestamp.fromDate(new Date()) }
      updateDoc(doc(db, 'new-partner', newPartnerId), { accepted: true })
        .then(() =>
          addDoc(collection(db, 'partner'), member)
        )

    } catch (error) {
      console.log(error);
      setnewPartner(null)
    } finally {
      setLoading(false)
    }
  }

  // console.log(member);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getDoc(doc(db, 'new-partner', id))
        if (data.exists()) {
          setnewPartner({ _id: data.id, ...data.data() });
        } else {
          setnewPartner(null)
        }
      } catch (error) {
        setnewPartner(null)
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
      filename: `${newPartner.name}_recap_fibree.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(element).save()
  }

  if (loading) { return <Loading></Loading> }
  if (!newPartner) { return <Page404 message={'Demande de partenariat non trouvée'} prev={'Revenir aux demande de partenariats'} prevLink={'/admin/nouveau-partenaire'} /> }


  return (
    <div className="page flex justify-center items-center">
      <div className="w-full max-w-[700px] mt- mb-5 p-2">
        <div ref={recapRef} style={{ backgroundColor: 'white', borderColor: 'gray' }} className="border overflow-hidden rounded-md">
          <div style={{ backgroundColor: 'green', color: "white" }} className="p-2 flex justify-between">
            <div>
              <i class="fa-solid fa-circle-user"></i> <span className=""> {newPartner.name}</span> <br />
              <i class="fa-solid fa-phone"></i> <span className="ml-">{newPartner.tel}</span> <br />
              <i className="fa-solid fa-location-dot"></i> <span>{newPartner.city}, {newPartner.country}</span> <br />
              <i className="fa-solid fa-calendar"></i> <span>{PublishTime(newPartner.sendDate)}</span>
            </div>
            <img src="/logo/logo.png" alt="" className='h-[100px] w-[100px] rounded-md' />
          </div>

          <div className="p-2">

            <div className="mt-1 space-y-3">

              <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                <span className="font-semibold">Email</span>
                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{newPartner.email}</span>
              </div>

              <div style={{ borderColor: "rgba(0,0,0,0.3)" }} className="flex justify-between border-b pb-2 gap-3">
                <span className="font-semibold">Profession</span>
                <span style={{ color: "rgba(0, 0, 0, 0.56)" }}>{newPartner.profession}</span>
              </div>
            </div>

            <div className="mt-6">
              <h6 className="font-semibold mb-2">Motivation</h6>
              <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                {newPartner.motivation}
              </div>
            </div>

            <div className="mt-4">
              <h6 className="font-semibold mb-2">Ce que vous souhaitez apporter à la FIBREE</h6>
              <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                {newPartner.contribution}
              </div>
            </div>

            <div className="mt-4">
              <h6 className="font-semibold mb-2">Ce que vous espérez gagner de la FIBREE</h6>
              <div style={{ backgroundColor: "rgba(0, 0, 0, 0.01)", color: 'gray' }} className="border rounded-md p-2  whitespace-pre-line">
                {newPartner.expectation}
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
              AcceptPartner(newPartner._id)
              navigate('/admin/nouveau-partenaire')
            }}
            className="btn btn-primary"
            disabled={newPartner.accepted}
          >
            {`${newPartner.accepted ? "Déjà accepté" : "Accepter"}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default newPartnerDetailAdmin;