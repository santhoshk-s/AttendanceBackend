// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const createDynamicSchema = (jobType) => {
//   const dynamicSchema = new Schema({
//     username:{
//         type:String,
//         // required:true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     jobType: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     pdf: {
//       type: String, // This should be a string if you're storing file paths
//       required: true,
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//   });

//   return mongoose.model(`${jobType}`, dynamicSchema);
// };

// module.exports = createDynamicSchema;
const mongoose = require('mongoose');
const { Schema } = mongoose;

const createDynamicSchema = (jobType) => {
  if (mongoose.models[jobType]) {
    return mongoose.models[jobType];
  }

  const schemaDefinition = new Schema({
    username:{type:String},
    email: { type: String, required: true },
    name: { type: String, required: true },
    jobType: { type: String, required: true },
    pdf: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }, // Assuming you are using GridFS or similar for file storage
     createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date and time when the document is created
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Optionally, set this to the current date and time
    },
  });

  const model = mongoose.model(jobType, schemaDefinition);
  return model;
};

module.exports = createDynamicSchema;
