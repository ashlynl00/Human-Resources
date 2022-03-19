const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    name: {type:String, required: true},
    role: {type:String, required: true},
    salary: {type:Number, required:true},
    age: {type:Number, required:true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    companyID: {type: Number, required: true},
    files: {type: String},
}, {timestamps: true})

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;