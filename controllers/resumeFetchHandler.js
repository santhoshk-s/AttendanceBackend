const createDynamicSchema = require('../modals/dynamicSchema');

const getFilesByJobType = async (req, res) => {
  const { jobType } = req.params;

  if (!jobType) {
    return res.status(400).json({ error: 'Job type is required' });
  }

  // Create the dynamic schema model
  const DynamicModel = createDynamicSchema(jobType);

  try {
    const files = await DynamicModel.find();
    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Error fetching files' });
  }
};

module.exports = { getFilesByJobType };
