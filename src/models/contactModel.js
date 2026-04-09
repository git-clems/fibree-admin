import { Timestamp } from "firebase/firestore"

const contactSchema = {
    fname: "",
    lname: "",
    email: "",
    country: "",
    city: "",
    object: "",
    message: "",
    ugc: false,
    contactDate: Timestamp.fromDate(new Date()),
    opened: false
}

export default contactSchema