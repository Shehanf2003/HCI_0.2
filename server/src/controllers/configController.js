const AppConfig = require('../models/AppConfig');

const getConfig = async (req, res) => {
  try {

    let config = await AppConfig.findOne();

    if (!config) {
      config = await AppConfig.create({});
    }

    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
