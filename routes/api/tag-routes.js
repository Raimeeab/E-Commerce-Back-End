const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  try {
    // Find all tags
    Tag.findAll({
      // Include its associated Product data
      include: [
        Product,
        {
          model: Product,
          through: ProductTag
        },
      ],
    })
    .then((tags) => res.json(tags))
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  try {
    Tag.findOne({
      where: {
        id: req.params.id,
      },
      // Include its associated Product data
      include: [
        Product,
        {
          model: Product,
          through: ProductTag
        },
      ],
    })
    .then((tag) => res.status(200).json(tag));
  } catch (err){
    res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
