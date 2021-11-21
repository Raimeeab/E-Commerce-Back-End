const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products
router.get('/', (req, res) => {
  try {
    Product.findAll({
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    })
    .then((product) => {
      if(!product) {
        return res.status(404).json({message: 'No products found'});
      };
      res.json(product);
    });
  } catch (err){
    console.log(err);
    res.status(500).json(err);

  }
});

// GET one product
router.get('/:id', (req, res) => {
  try {
    Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "No product found with this ID" });
      };
      res.status(200).json(product)
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  };

});

// CREATE new product
router.post('/', (req, res) => {
  Product.create(req.body)
  .then((product) => {
    // If there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagId.length) {
      const productTagIdArr = req.body.tagId.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }

    // If no product tags, just respond
    res.status(200).json(product);
  })
  .then((productTagId) => res.status(200).json(productTagId))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // Find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // GET list of current tag_ids
      const producttagId = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagId
        .filter((tag_id) => !producttagId.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // Figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagId.includes(tag_id))
        .map(({ id }) => id);

      // Run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
 try {
   const productData = await Product.destroy({
     where: {
       id: req.params.id
     }
   });  

     // If ID does not exist in db, display error
   if (!productData) {
    return res.status(404).json({ message: "Product does not exist, check ID entry." });
   } else {
    res.status(200).json({
      message: "Product sucessfully deleted",
      productData
    });
  };
 } catch (err) {
   res.status(500).json(err);
 }
});

module.exports = router;