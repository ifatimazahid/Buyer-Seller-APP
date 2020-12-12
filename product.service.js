const { ProductData } = require("../../Models/product.model");
const _ = require("lodash");
const axios = require("axios");
const api_rw_key = "xyz";
const api_r_key = "xyz";
const { SellerProductData } = require("../../Models/sellerProduct.model");

//***** Product data add function *****//
async function createProduct(req, res, data) {
  try {

    var products;
    if (req.role == 1 || req.role == 2) {

      req.body.category = _.uniq(req.body.category);
      req.body.product_colors.map((p) => {
        p.images = _.uniq(p.images);
        p.skus = _.uniqBy(p.skus, 'catalog_sku_id');
      });

      let product = new ProductData(req.body);
      let result = await product.save();
      products = await ProductData.find({
        isActive: true,
        isDeleted: false
      })
        .populate({ path: "category", model: "categories" })
        .limit(50)
        .sort({ createdDate: -1 });
      let payload = {
        success: true,
        msg: "Product added successfully!",
        data: products,
        new: result,
      };
      res.send(payload);
      return;
    } else if (req.role == 3) {

      await SellerProductData.insertMany(data, async (err, products_created) => {
        if (err) {
          let errr = { success: false, msg: err };
          res.status(403).send(errr);
          return;
        }
        products = await SellerProductData.find({
          isActive: true,
          userId: req.user._id,
          isDeleted: false
        })
          .populate({ path: "category", model: "categories" })
          .limit(50)
          .sort({ createdDate: -1 });

        let payload = {
          success: true,
          msg: "Products added successfully!",
          data: products,
          new: products_created,
        };
        res.send(payload);
      });
      return;
    }
  } catch (err) {
    let error = {
      success: false,
      error: err,
      data: null,
    };
    res.status(500).send(error);
    return;
  }
}

//***** Product data update function *****//
async function editProduct(req, res) {
  try {
    if (req.role == 1 || req.role == 2) {
      req.body.updatedDate = Date.now();
      ProductData.findOneAndUpdate(
        { _id: req.params.productId },
        req.body,
        async (err, result) => {
          if (err) {
            let errr = { success: false, msg: err };
            res.status(409).send(errr);
            return;
          }

          var product = await ProductData.findOne({ _id: result._id })
            .populate({ path: "category", model: "categories" })

          var data = { success: true, msg: "Product updated!", data: product };
          res.send(data);
          return;
        }
      );
    } else if (req.role == 3) {

      req.body.updatedDate = Date.now();
      SellerProductData.findOneAndUpdate(
        {
          _id: req.params.productId,
          userId: req.user._id
        },
        req.body,
        async (err, result) => {
          if (err) {
            let errr = { success: false, msg: err };
            res.status(409).send(errr);
            return;
          }

          var product = await SellerProductData.findOne({ _id: result._id });

          var data = { success: true, msg: "Product updated!", data: product };
          res.send(data);
          return;
        }
      );
    }
  } catch (err) {
    let error = {
      success: false,
      error: err,
      data: null,
    };
    res.status(500).send(error);
    return;
  }
}


//incomplete
//***** Product Sku update function *****//
async function editSkuProduct(req, res) {
  try {
    if (req.role == 1 || req.role == 2) {

      let products;
      req.body.updatedDate = Date.now();
      products = await ProductData.findOne({
        _id: req.query.productId,
        "product_colors.skus.catalog_sku_id": req.params.sku,
        userId: req.user._id
      })

      let get_id = products.product_colors.filter(function (o) {
        return o.product_color_id == req.query.productColorId;
      })[0];

      let mappedData = get_id.skus.map((s) => {
        if (req.params.sku == s.catalog_sku_id) {
          s.baseCost = req.body.baseCost
        }
        return s;
      });

      ProductData.findOneAndUpdate(
        {
          _id: req.query.productId,
          "product_colors.skus.catalog_sku_id": req.params.sku,
          userId: req.user._id,
          isDeleted: false
        },
        {
          "product_colors.$.skus": mappedData
        },
        async (err, result) => {
          if (err) {
            let errr = { success: false, msg: err };
            res.status(409).send(errr);
            return;
          }

          products = await ProductData.findOne({ _id: result._id })
            .populate({ path: "category", model: "categories" })
          if (products != null) {

            //find all the products for Seller
            req.body.updatedDate = Date.now();
            seller_products = await SellerProductData.find({
              admin_product_id: req.query.productId,
              "product_colors.skus.catalog_sku_id": req.params.sku,
              isDeleted: false
            })
            //filter through themm to find product color id 
            Promise.all(
              _.map(seller_products.map(product => {
                product.product_colors.forEach(product_color => {
                  product_color.skus.forEach(sku => {
                    if (sku.catalog_sku_id == req.params.sku) {
                      sku.sellingPrice = 0
                      sku.profit = 0
                      sku.isActive = false
                    }
                  })
                })
                return product
              }), async updated_products_seller => {
                console.log(updated_products_seller._id)
                await SellerProductData.update({
                  _id: updated_products_seller._id,
                  isDeleted: false
                }, updated_products_seller, (err, raw) => {
                  if (err) {
                    let errr = { success: false, msg: err };
                    res.status(409).send(errr);
                    return;
                  } 
                })
              })
            ).then(() => {
              var data = { success: true, msg: "Product updated!", data: products };
              res.send(data);
              return;
            })
          } else { 
            var errors = { success: false, msg: "No Product found!" };
            res.status(200).send(errors);
            return;
          }
        }
      );
    } else if (req.role == 3) {

      let products;
      // req.body.updatedDate = Date.now();
      products = await SellerProductData.findOne({
        _id: req.query.productId,
        "product_colors.skus.catalog_sku_id": req.params.sku,
        userId: req.user._id
      })


      let get_id = products.product_colors.filter(function (o) {
        return o.product_color_id == req.query.productColorId;
      })[0];

      let mappedData = get_id.skus.map((s) => {
        if (req.params.sku == s.catalog_sku_id) {
          s.sellingPrice = req.body.sellingPrice,
            s.profit = req.body.profit,
            s.isActive = req.body.isActive
        }
        return s;
      });


      SellerProductData.findOneAndUpdate(
        {
          _id: req.query.productId,
          "product_colors.skus.catalog_sku_id": req.params.sku,
          userId: req.user._id
        },
        {
          "product_colors.$.skus": mappedData
        },
        async (err, result) => {
          if (err) {
            let errr = { success: false, msg: err };
            res.status(409).send(errr);
            return;
          }

          var product = await SellerProductData.findOne({ _id: result._id });
          var data = { success: true, msg: "Product updated!", data: product };
          res.send(data);
          return;
        });
    }
  } catch (err) {
    let error = {
      success: false,
      error: err,
      data: null,
    };
    res.status(500).send(error);
    return;
  }
}



//***** Product data delete function *****//
async function deleteProduct(req, res, criteria) {
  try {

    req.body.isDeleted = true;
    req.body.isActive = false;

    var products;
    if (req.role == 1 || req.role == 2) {

      ProductData.findOneAndUpdate(criteria, req.body, async (err, result) => {
        if (err) {
          let errr = { success: false, msg: err };
          res.status(403).send(errr);
          return;
        }
      });

      products = await ProductData.find({
        isActive: true,
        isDeleted: false
      })
        .populate({ path: "category", model: "categories" })
        .limit(50)
        .sort({ createdDate: -1 });

      await SellerProductData.updateMany({ admin_product_id: req.params.productId },
        req.body, async (err, result) => {
          if (err) {
            let errr = { success: false, msg: err };
            res.status(403).send(errr);
            return;
          }
        });

    } else if (req.role == 3) {

      await SellerProductData.findOneAndUpdate({ _id: req.params.productId },
        req.body, async (err, result) => {
          if (err) {
            let errr = { success: false, msg: err };
            res.status(403).send(errr);
            return;
          }
        });

      products = await SellerProductData.find({
        isActive: true,
        userId: req.user._id,
        isDeleted: false
      })
        .limit(50)
        .sort({ createdDate: -1 });
    }

    var data = { success: true, msg: "Product deleted!", data: products };
    res.send(data);
    return;

  } catch (err) {
    let error = {
      success: false,
      error: err,
      data: null,
    };
    res.status(500).send(error);
    return;
  }
}

//***** Product data search by filtering skus catalog function *****//
async function filterInactiveSKUS(product) {
  return new Promise(async (resolve, reject) => {
    for (let index = 0; index < product.product_colors.length; index++) {
      let product_color = product.product_colors[index];
      let readySKUS = []
      for (let index_nested = 0; index_nested < product_color.skus.length; index_nested++) {
        let sku = product_color.skus[index_nested];
        if (sku.isActive == true) {
          readySKUS.push(sku);
        } 
      }
      product_color.skus = readySKUS
    }
    resolve(product);
  })
}

//***** Product data search by filtering skus catalog function *****//
async function filterSKUSearching(product) {
  return new Promise(async (resolve, reject) => {
    for (let index = 0; index < product.product_colors.length; index++) {
      let product_color = product.product_colors[index];
      let readySKUS = []
      for (let index_nested = 0; index_nested < product_color.skus.length; index_nested++) {
        let sku = product_color.skus[index_nested];
        await searchSkuProduct(sku).then((data) => {
          if (data.in_stock != 0 && sku.isActive == true) {
            readySKUS.push(sku)
            console.log(data.catalog_sku_id, data.in_stock, "available on CC")
          } else {
            console.log(data.catalog_sku_id, data.in_stock, "unavailable on CC! Skipping.")
          }
        }).catch(error => {
          reject(error)
        })
      }
      product_color.skus = readySKUS
      console.log("Updating your SKUSSS")
    }
    console.log("Here's your stupid product")
    resolve(product)
  })
}

//***** Product data search by catalog function *****//
async function searchSkuProduct(sku) {
  return new Promise(async (resolve, reject) => {
    let url = `https://customcat-beta.mylocker.net/api/v1/catalog/sku/${sku.catalog_sku_id}?api_key=${api_r_key}`;
    await axios
      .get(`${url}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      });
  })
}

//***** Product data search by catalog function *****//
async function searchCatalogSkuProduct(req, res, cb) {

  let catalog_sku_id = parseInt(req.params.sku);

  let url = `https://customcat-beta.mylocker.net/api/v1/catalog/sku/${catalog_sku_id}?api_key=${api_r_key}`;
  axios
    .get(`${url}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      return cb(response.data);
    })
    .catch((error) => {
      console.log("error", error);
      res.send(error);
      return;
    });
}

//***** Search all Catalog  *****//
async function searchCatalog(req, res) {
  let url = `https://customcat-beta.mylocker.net/api/v1/catalog/`;
  axios
    .get(`${url}`, {
      params: {
        api_key: api_r_key,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      let responseObject = { data: response.data };
      res.send(responseObject);
      return;
    })
    .catch((error) => {
      console.log("error", error);
      res.send(error);
      return;
    });
}

//***** Product data search by catalog function *****//
async function searchCatalogProduct(req, res) {
  let catalog_product_id = req.params.catalogId;
  let url = `https://customcat-beta.mylocker.net/api/v1/catalog/${catalog_product_id}`;
  axios
    .get(`${url}`, {
      params: {
        api_key: api_r_key,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      res.send(response.data);
      return;
    })
    .catch((error) => {
      console.log("error", error);

      res.send(error);
      return;
    });
}

//***** Product data search function *****//
async function searchProducts(req, res) {
  let url = `https://customcat-beta.mylocker.net/api/v1/product`;
  axios
    .get(`${url}`, {
      params: {
        api_key: api_r_key,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      let responseObject = { data: response.data };
      res.send(responseObject);
      return;
    })
    .catch((error) => {
      console.log("error", error);
      res.send(error);
      return;
    });
}

exports.searchCatalogSkuProduct = searchCatalogSkuProduct;
exports.searchCatalog = searchCatalog;
exports.searchCatalogProduct = searchCatalogProduct;
exports.searchProducts = searchProducts;
exports.createProduct = createProduct;
exports.filterInactiveSKUS = filterInactiveSKUS;
exports.filterSKUSearching = filterSKUSearching;
exports.searchSkuProduct = searchSkuProduct;
exports.editProduct = editProduct;
exports.editSkuProduct = editSkuProduct;
exports.deleteProduct = deleteProduct;
