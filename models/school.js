const mongoose = require('mongoose');



const schoolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        coordinates: {
            type: String,
            required: true,
        },
        ageRange: {
            type: String,
            required:true,
            enum: ['Primary', 'Secondary', 'Through', 'SEN', 'Prep']
        },
        category: {
            type: String,
            required: true,
            enum: ['State', 'Independent', 'Academy']
        },
        currentJobs: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        pastJobs: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        }, 
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    {timestamps: true}
);

const School = mongoose.model('School', schoolSchema);

module.exports = School;
