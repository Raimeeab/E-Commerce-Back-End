const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  try {
    // Find all categories
    Category.findAll({
      // Include its associated Products
      include: [
        {
          model: Product, 
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        },
      ],
    })
    .then((category) => {
      if(!category) {
        res.status(404).json({message: 'No categories found'});
        return;
      };
      res.json(category);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', (req, res) => {
  try {
    // Find one category by its `id` value
    Category.findOne({
      where: {
        id: req.params.id
      },
      // Include its associated Products
      include: [
        {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
        },
      ],
    })
    .then((category) => {
      if (!category) {
        res.status(404).json({ message: "No category found with this ID" })
        return
      };
      res.status(200).json(category)
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // CREATE a new category
  try {

    if(!req.body.category_name) {
      res.status(400).json({ message: "Entry is null" });
      return;
    };

    newCategory = await Category.create(req.body);

    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  };

});

router.put('/:id', async (req, res) => {
  // UPDATE a category by its `id` value
  try {
    
    const updateCategory = await Category.update(
      req.body, {
        where: {
          id: req.params.id
        }
    });

    if (!req.body.category_name) {
      res.status(400).json({ message: "Update unsucessful, no value provided" });
      return
    };

    // TODO: Why does insomnia still send a 200 status response?? 
    if (!updateCategory){
      res.status(404).json({ message: "Category does not exist, check ID entry." });
      return
    };
    
    res.status(200).json(updateCategory);

  } catch (err) {
    res.status(500).json(err);
   };
});

router.delete('/:id', async (req, res) => {
  // DELETE a category by its `id` value
 try {
  const categoryData = await Category.destroy({
    where: {
      id: req.params.id
    }
  });

  // If ID does not exist in db, display error
  if(!categoryData) {
    res.status(404).json({ message: "Category does not exist, check ID entry." });
    return
  } else {
    res.status(200).json({
      message: "Category sucessfully deleted",
      categoryData
    });
  };
 } catch (err) {
   res.status(500).json(err);
 }
});

module.exports = router;
