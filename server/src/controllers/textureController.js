const Texture = require('../models/Texture');

const uploadTexture = async (req, res) => {
  try {
    const { name, type, url, imageUrl } = req.body;

    const finalUrl = url || imageUrl;

    if (!finalUrl) {
        return res.status(400).json({ message: 'Please provide a texture URL' });
    }

    if (!['wall', 'floor'].includes(type)) {
        return res.status(400).json({ message: 'Type must be either wall or floor' });
    }

    const texture = new Texture({
      name,
      type,
      url: finalUrl,
    });

    const createdTexture = await texture.save();
    res.status(201).json(createdTexture);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

const getTextures = async (req, res) => {
    try {
        const textures = await Texture.find({});
        res.json(textures);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
}

module.exports = {
  uploadTexture,
  getTextures
};
