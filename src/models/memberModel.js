import { Timestamp } from 'firebase/firestore'
const memberSchema = {
    fname: "",
    lname: "",
    email: "",
    country: "",
    city: "",
    profession: "",
    motivation: "",
    contribution: "",
    expectation: "",
    ugc: false,
    acceptedDate: Timestamp.fromDate(new Date()),
    opened : false
}

export default memberSchema