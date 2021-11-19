const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // Find all categories
  // Include its associated Products
});

router.get('/:id', (req, res) => {
  // Find one category by its `id` value
  // Include its associated Products
});

router.post('/', (req, res) => {
  // CREATE a new category
});

router.put('/:id', (req, res) => {
  // UPDATE a category by its `id` value
});

router.delete('/:id', async (req, res) => {
  // DELETE a category by its `id` value
 try {
  const categoryData = await Category.destroy({
    where: {
      id: req.params.id
    }
  });

  if(!categoryData) {
    res.status(404).json({ message: "Category does not exist, check ID entry." });
    return
  };

  res.status(200).json(categoryData);
  
 } catch (err) {
   res.status(500).json(err);
 }
});

module.exports = router;
