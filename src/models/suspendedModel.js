import { Timestamp } from 'firebase/firestore'
const memberSchema = {
    suspendedDate: Timestamp.fromDate(new Date()),
}

export default memberSchema