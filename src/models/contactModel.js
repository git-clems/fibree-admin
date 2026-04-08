import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
    fname: "",
    lname: "",
    email: "",
    country: "",
    city: "",
    object: "",
    message: "",
    ugc: false
})

export default mongoose.model("Contacts", contactSchema)