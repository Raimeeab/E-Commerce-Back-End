// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products has one Category
// Product.belongsTo(Category, {
//   through: {
//     model: category,
//     unique: true
//   }
// });

// Categories have many Products
// Category.belongsToMany(Product, {
//   through: {
//     model: 
//     unique: false
//   }
// })

// Products belongToMany Tags (through ProductTag)

// Tags belongToMany Products (through ProductTag)

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
