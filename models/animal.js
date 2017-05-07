import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

// schema definition for the 'animals' collection
const animalSchema = new mongoose.Schema({
  type: {type: String, required: true},
  name: {type: String, required: true},
  age: {type: Number, required: true},
  picture: {type: String, required: true}
})

// add mongoosePaginate to the schema to get a paginate() method on our model
animalSchema.plugin(mongoosePaginate)

export default mongoose.model('animals', animalSchema)
