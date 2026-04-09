import { Timestamp } from "firebase/firestore"

const newPartner = {
    name: "",
    lname: "",
    email: "",
    country: "",
    city: "",
    tel: "",
    profession: "",
    motivation: "",
    contribution: "",
    expectation: "",
    ugc: false,
    sendDate : Timestamp.fromDate(new Date())
}

export default newPartner