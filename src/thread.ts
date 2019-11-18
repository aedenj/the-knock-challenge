const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const schema = new mongoose.Schema({
    id:    { type: Number },
    name:  { type: String, required: true, index: { unique: true } },
    users: { type: Array, required: true }
});

schema.plugin(AutoIncrement, { inc_field: 'id'})

export default mongoose.model('Thread', schema)
