const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  try {
    // Find all tags
    Tag.findAll({
      // Include its associated Product data
      include: [
        {
          model: Product,
          through: ProductTag
        },
      ],
    })
    .then((tags) => res.json(tags));
  } catch (err) {
    res.status(500).json(err);
  };
});

router.get('/:id', (req, res) => {
  // Find a single tag by its `id`
  try {
    Tag.findOne({
      where: {
        id: req.params.id,
      },
      // Include its associated Product data
      include: [
        {
          model: Product,
          through: ProductTag
        },
      ],
    })
    .then((tag) => {
      if (!tag){
        res.status(404).json({ message: "No tag found with this"});
        return
      };
      res.status(200).json(tag);
    })
  } catch (err) {
    res.status(500).json(err);
  };
});

router.post('/', async (req, res) => {
  // CREATE a new tag
  try {
    const tagData = await Tag.create({
      tag_name: req.body.tag_name
    });

    if(!tagData) {
      res.status(404).json({ message: "No tag found with this ID" })
    }

    res.status(200).json(tagData);

  } catch (err) {
    res.status(500).json(err);
  };
});

router.put('/:id', async (req, res) => {
  // UPDATE a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if(!tagData) {
      res.status(404).json({ message: "No tag found with this ID" })
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  };
});

router.delete('/:id', async (req, res) => {
  // DELETE on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

      // If ID does not exist in db, display error
    if (!tagData) {
      res.status(400).json({ message: "Tag does not exist, check ID entry. "});
      return
    };

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  };
});

module.exports = router;
