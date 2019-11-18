import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    threadId: { type: Number, required: true },
    user:     { type: String, required: true },
    message:  { type: String, required: true }
});

export default mongoose.model('Message', schema)
