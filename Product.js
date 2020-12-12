const express = require("express");
const axios = require("axios");
const _ = require("lodash");
const { isAuthenticated } = require("../../middleware/auth");
const { checkAdmin, AdminOrSeller } = require("../../middleware/role");
const { ProductData } = require("../../Models/product.model");
const { CategoryData } = require("../../Models/category.model");
const {
  validateProductData,
  validatEditProductData,
  validateEditAdminSku,
} = require("../Validate");
const {
  createProduct,
  editProduct,
  deleteProduct,
  editSkuProduct,
  searchCatalogSkuProduct,
  searchCatalog,
  searchCatalogProduct,
  searchProducts,
} = require("../services/product.service");
const { toInteger } = require("lodash");
const mongoose = require("mongoose");
const { SellerProductData } = require("../../Models/sellerProduct.model");
//***** ///// *****//

//***** Express Router to export in module *****//
const app = express();

//************************ GET ALL CATALOG ***********************//
app.get(
  "/custom-cat/catalog",
  isAuthenticated(),
  checkAdmin(),
  async (req, res) => {
    await searchCatalog(req, res);
  }
);

//************************ GET CUSTOM-CAT PRODUCTS BY CATALOG ID ***********************//
app.get(
  "/custom-cat/catalog-product/:catalogId",
  isAuthenticated(),
  checkAdmin(),
  async (req, res) => {
    await searchCatalogProduct(req, res);
  }
);

//************************ GET CUSTOM-CAT CATALOG PRODUCTS BY CATALOG SKU ID ***********************//
app.get(
  "/custom-cat/catalog-sku-products/:skuId",
  isAuthenticated(),
  checkAdmin(),
  async (req, res) => {
    await searchCatalogSkuProduct(req, res, data => res.json(data));
  }
);

//************************ GET ALL CUSTOM-CAT PRODUCTS ***********************//
app.get(
  "/custom-cat/all-products",
  isAuthenticated(),
  checkAdmin(),
  async (req, res) => {
    await searchProducts(req, res);
  }
);

//************************ GET ADMIN PRODUCTS ***********************//
app.get(
  "/getAdminProducts",
  isAuthenticated(),
  AdminOrSeller(),
  async (req, res) => {
    var limit = toInteger(req.query.limit);
    var page = toInteger(req.query.page);
    await ProductData.find({
      isActive: true,
      isDeleted: false,
    })
      .populate({ path: "category", model: "categories" })
      .skip(limit * (page - 1) ? limit * (page - 1) : 0)
      .limit(limit ? limit : 50)
      .exec(async function (err, products) {
        ProductData.count({ isDeleted: false }).exec(async function (
          err,
          count
        ) {
          if (products.length == 0) {
            var errors = { success: false, msg: "No Product found!" };
            res.status(200).send(errors);
            return;
          } else {
            // Product filtering for specific user
            if (req.role == 3) {
              let queryStr = {
                isDeleted: false,
                isActive: true,
                userId: req.user._id,
              };
              if (
                req.query.store != null &&
                req.query.store != undefined &&
                req.query.store != ""
              ) {
                queryStr["storeId"] = req.query.store;
                console.log(queryStr)
                let seller_products = await SellerProductData.find(queryStr);
                console.log(seller_products)
                products = _.reject(products, (product) => { 
                  if (
                    _.findIndex(seller_products, [
                      "admin_product_id",
                      product._id,
                    ]) >= 0
                  ) { 
                    return product;
                  }
                });
              }
            }

            var success = {
              success: true,
              msg: "Products found",
              data: products,
              page: page,
              pages: Math.floor(count / limit),
            };
            res.send(success);
            return;
          }
        });
      });
  }
);

//working on this
//************************ GET SELLER PRODUCTS ***********************//
app.get(
  "/getSellerProducts",
  isAuthenticated(),
  checkAdmin(),
  async (req, res) => {
    var limit = toInteger(req.query.limit);
    var page = toInteger(req.query.page);
    let queryStr = {
      isDeleted: false,
      isActive: true,
    };
    if (
      req.query.store != null &&
      req.query.store != undefined &&
      req.query.store != ""
    ) {
      queryStr["storeId"] = req.query.store;
    }
    if (
      req.query.seller != null &&
      req.query.seller != undefined &&
      req.query.seller != ""
    ) {
      queryStr["userId"] = req.query.seller;
    }
    await SellerProductData.find(queryStr)
    .populate({
      path: "admin_product_id", model: "product",
      populate: {
        path: 'category',
        model: 'categories'
      }
    })
      .skip(limit * (page - 1) ? limit * (page - 1) : 0)
      .limit(limit ? limit : 50)
      .sort({ createdDate: -1 })
      .exec(async function (err, products) {
        products = await CategoryData.populate(products, { path: "category" });
        SellerProductData.count({ isDeleted: false }).exec(function (
          err,
          count
        ) {
          if (products.length == 0) {
            var errors = { success: false, msg: "No Product found!" };
            res.status(200).send(errors);
            return;
          } else {
            var success = {
              success: true,
              msg: "Products found",
              data: products,
              page: page,
              pages: Math.floor(count / limit),
            };
            res.send(success);
            return;
          }
        });
      });
  }
);

//************************ GET PRODUCTS BY CATEGORY ID ***********************//
app.get(
  "/getByCategory/:categoryId",
  isAuthenticated(),
  checkAdmin(),
  async (req, res) => {
    var limit = toInteger(req.query.limit);
    var page = toInteger(req.query.page);

    await ProductData.find({
      category: mongoose.Types.ObjectId(req.params.categoryId),
      isDeleted: false,
    })
      .populate({ path: "category", model: "categories" })
      .skip(limit * (page - 1) ? limit * (page - 1) : 0)
      .limit(limit ? limit : 50)
      .sort({ createdDate: -1 })
      .exec(async function (err, products) {
        ProductData.count({ isDeleted: false }).exec(function (err, count) {
          if (products.length == 0) {
            var errors = { success: false, msg: "No Product found!" };
            res.status(200).send(errors);
            return;
          } else {
            var success = {
              success: true,
              msg: "Products found",
              data: products,
              page: page,
              pages: Math.floor(count / limit),
            };
            res.send(success);
            return;
          }
        });
      });
  }
);

//************************ GET ONE PRODUCT ***********************//
app.get(
  "/get/:productId",
  isAuthenticated(),
  checkAdmin(),
  async (req, res) => {
    const product = await ProductData.findOne({
      _id: req.params.productId,
      isDeleted: false,
    }).populate({ path: "category", model: "categories" });

    if (!product) {
      var errors = { success: false, msg: "No Product found!" };
      res.status(200).send(errors);
      return;
    } else {
      let productObj = { product };
      var success = { success: true, msg: "Product found", data: productObj };
      res.send(success);
      return;
    }
  }
);

//************************ CREATE ONE PRODUCT ***********************//
app.post("/create", isAuthenticated(), checkAdmin(), async (req, res) => {
  let { error } = validateProductData(req.body);

  if (error) {
    var errors = {
      success: false,
      msg: error.details[0].message,
      data: error.name,
    };
    res.status(400).send(errors);
    return;
  }

  error = req.body.category.length == 0 ? true : false;
  if (error) {
    var errors = {
      success: false,
      msg: "categories cannot be empty",
    };
    res.status(400).send(errors);
    return;
  }
  error = req.body.product_colors.length == 0 ? true : false;
  if (error) {
    var errors = {
      success: false,
      msg: "product colors cannot be empty",
    };
    res.status(400).send(errors);
    return;
  }
  for (let index = 0; index < req.body.product_colors.length; index++) {
    if (req.body.product_colors[index].skus.length == 0) {
      error = true;
      break;
    } else {
      error = false;
    }
  }
  if (error) {
    var errors = {
      success: false,
      msg: "product color SKU cannot be empty",
    };
    res.status(400).send(errors);
    return;
  }
  req.body.userId = req.user._id;
  let alreadyExist = await ProductData.findOne({
    catalog_product_id: req.body.catalog_product_id,
    isDeleted: false,
  });

  if (alreadyExist != null) {
    var err = {
      success: false,
      msg: "This Product already exists!",
    };
    res.status(409).send(err);
    return;
  }
  await createProduct(req, res, null);
});

//************************ EDIT ONE PRODUCT ***********************//
app.put(
  "/edit/:productId",
  isAuthenticated(),
  checkAdmin(),
  async (req, res) => {
    let { error } = validatEditProductData(req.body);
    if (error) {
      var errors = {
        success: false,
        msg: error.details[0].message,
        data: error.name,
      };
      res.status(400).send(errors);
      return;
    }

    error = req.body.category.length == 0 ? true : false;
    if (error) {
      var errors = {
        success: false,
        msg: "categories cannot be empty",
      };
      res.status(400).send(errors);
      return;
    }
    error = req.body.product_colors.length == 0 ? true : false;
    if (error) {
      var errors = {
        success: false,
        msg: "product colors cannot be empty",
      };
      res.status(400).send(errors);
      return;
    }
    for (let index = 0; index < req.body.product_colors.length; index++) {
      if (req.body.product_colors[index].skus.length == 0) {
        error = true;
        break;
      } else {
        error = false;
      }
    }
    if (error) {
      var errors = {
        success: false,
        msg: "product color SKU cannot be empty",
      };
      res.status(400).send(errors);
      return;
    }
    await editProduct(req, res);
  }
);

//************************ EDIT ONE SKU ***********************//
app.put("/edit/sku/:sku", isAuthenticated(), checkAdmin(), async (req, res) => {
  let { error } = validateEditAdminSku(req.body);
  if (error) {
    var errors = {
      success: false,
      msg: error.details[0].message,
      data: error.name,
    };
    res.status(400).send(errors);
    return;
  }

  if (!req.params.sku) {
    var errors = {
      success: false,
      msg: "Please enter Catalog SKU Id!",
    };
    res.status(400).send(errors);
    return;
  }

  await searchCatalogSkuProduct(req, res, async (data) => {
    if (req.body.baseCost <= data.cost) {
      var err = {
        success: false,
        msg: "Your base cost can not be less than Custom cat cost!",
      };
      res.status(409).send(err);
      return;
    } else {
      await editSkuProduct(req, res);
    }
  });
});

//************************ DELETE ONE PRODUCT ***********************//
app.delete(
  "/delete/:productId",
  isAuthenticated(),
  checkAdmin(),
  async (req, res) => {
    let alreadyExist = await ProductData.findOne({
      _id: req.params.productId,
      isDeleted: false,
    });

    if (alreadyExist == null) {
      var err = {
        success: false,
        msg: "This Product does not exist!",
      };
      res.status(409).send(err);
      return;
    }

    let criteria = { _id: req.params.productId, isDeleted: false };
    await deleteProduct(req, res, criteria);
  }
);

module.exports = app;
