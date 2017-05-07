import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const animalSchema = new mongoose.Schema({
  type: {type: String, required: true},
  name: {type: String, required: true},
  age: {type: Number, required: true},
  picture: {type: String, required: true}
})

animalSchema.plugin(mongoosePaginate)

export default mongoose.model('animals', animalSchema)
