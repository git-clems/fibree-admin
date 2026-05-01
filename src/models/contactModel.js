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
    opened: false
}

export default contactSchema