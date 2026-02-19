const AppConfig = require('../models/AppConfig');

// @desc    Get global app configuration
// @route   GET /api/config
// @access  Public
const getConfig = async (req, res) => {
  try {
    // Find the first document. Since we only want one config, we can just grab the first one.
    let config = await AppConfig.findOne();

    // If no config exists, create a default one
    if (!config) {
      config = await AppConfig.create({});
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update global app configuration
// @route   PUT /api/config
// @access  Private
const updateConfig = async (req, res) => {
  const { homeBackgroundUrl } = req.body;

  try {
    let config = await AppConfig.findOne();

    if (!config) {
      config = new AppConfig();
    }

    if (homeBackgroundUrl !== undefined) {
      config.homeBackgroundUrl = homeBackgroundUrl;
    }

    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConfig,
  updateConfig,
};
