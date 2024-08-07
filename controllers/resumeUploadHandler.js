const createDynamicSchema = require('../modals/dynamicSchema');

const createSchemaAndUploadFile = async (req, res) => {
    const { jobType } = req.params;
    console.log('Received Job Type:', jobType);
    const { email,username } = req.body;

    if (!jobType) {
        return res.status(400).json({ error: 'Job type is required' });
    }

    // Create the dynamic schema model
    const DynamicModel = createDynamicSchema(jobType);

    try {
        // Initialize an array to hold the promises for saving files
        const savePromises = req.files.map(async (file) => {
            const newDoc = new DynamicModel({
                email: email,
                username:username,
                name: file.filename,
                jobType: jobType,
                pdf: file.id, // GridFS file ID
            });

            // Save the document and return the promise
            return newDoc.save();
        });

        // Await all save operations
        await Promise.all(savePromises);

        res.status(200).json({
            success: true,
            message: 'Files uploaded successfully',
            files: req.files,
        });
    } catch (error) {
        console.error('Error creating schema and uploading file:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating schema and uploading file',
            error: error.message,
        });
    }
};

module.exports = { createSchemaAndUploadFile };
