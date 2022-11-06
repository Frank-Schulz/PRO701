const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    root: {
      type: Boolean,
      default: false,
    },
    path: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    fullName: {
      type: String,
      trim: true,
      required: true
    },
    DOB: {
      type: Date,
      default: Date.now()
    },
    DOD: {
      type: Date,
      default: null
    },
    gender: {
      type: String,
      trim: true,
    },
    parents: {
      type: [],
      default: []
    },
    children: {
      type: [],
      default: []
    },
  },
  {
    timestamps: true,
  },
);

//TODO: Methods aren't saved to database, can't access on frontend
// peopleSchema
//   .virtual('age')
//   .get(function () {
//     let ageDifMs;

//     if (this.DOD) {
//       ageDifMs = this.DOD - new Date(this.DOB).getTime();
//     }
//     else {
//       ageDifMs = Date.now() - new Date(this.DOB).getTime();
//     }
//     const ageDate = new Date(ageDifMs);
//     return Math.abs(ageDate.getUTCFullYear() - 1970);
//   })

const People = mongoose.model('People', peopleSchema, 'people');


module.exports = People;
