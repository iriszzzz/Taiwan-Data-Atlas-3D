import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
    province: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    data: {
        type: Number,
        required: true
    },    
    province_id: {
        type: Number,
        required: true
    },
    region_id: {
        type: Number,
        required: true
    },
    ratio: {
        type: Number,
        required: true
    },
    occupation: {
        type: Number,
        required: true
    }
})

export default mongoose.model('Data', DataSchema, 'datas');
