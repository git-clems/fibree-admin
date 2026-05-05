import { Timestamp } from "firebase/firestore"

const eventSchema = {
    title: "",
    subtitle: "",
    link: "",
    linkMessage : "",
    description: "",
    displayed: false,
    image: "",
    comingDate : "",
    city : "",
    online : false,
}

export default eventSchema