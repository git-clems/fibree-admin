import { Timestamp } from "firebase/firestore"

const eventSchema = {
    title: "",
    subtitle: "",
    externalLink: "",
    description: "",
    displayed: false,
    image: "",
    comingDate : "",
    city : "",
    online : false,
    publishDate : Timestamp.fromDate(new Date()),
}

export default eventSchema