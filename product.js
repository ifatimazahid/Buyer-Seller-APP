const { ProductData } = require("../Models/product.model");
const { ImageData } = require("../Models/images.model");
var compose = require("composable-middleware");
const { SellerProductData } = require("../Models/sellerProduct.model");

function canChangeImage() {
  return (
    compose()
      // Attach user to request
      .use(async function (req, res, next) {
        if (req.role == 2) {
          // Is an admin and editing system products
          const product = await ProductData.findOne({
            _id: req.params.productId,
            isDeleted: false
          });

          if (!product) {
            var data = {
              success: false,
              msg: "You can not edit this Product",
              data: Data,
            };
            res.status(200).send(data);
            return;
          }
        } else if (req.role == 3) {
          // Is a seller and editing own products
          const product = await SellerProductData.findOne({
            userId: req.user._id,
            _id: req.params.productId,
            isDeleted: false,
          });

          if (!product) {
            var data = {
              success: false,
              msg: "You can not edit this Product",
              data: data,
            };
            res.status(200).send(data);
            return;
          }
        } else {
          var data = {
            success: false,
            msg: "No role defined",
            data: Data,
          };
          res.status(500).send(data);
          return;
        }

        next();
      })
  );
}

function canDeleteImage() {
  return (
    compose()
      // Attach user to request
      .use(async function (req, res, next) {
        let image;
        if (req.params.imageId != null) {
          image = await ImageData.findOne({ _id: req.params.imageId });
          if (!image) {
            var errors = {
              success: false,
              msg: "This image does not exist!",
            };
            res.status(409).send(errors);
            return;
          } else {
            req.image = image;
            next();
          }
        } else if (req.params.imageId == null) {
          image = await ImageData.findOne({ image: req.body.image });
          if (!image) {
            var errors = {
              success: false,
              msg: "This image does not exist!",
            };
            res.status(409).send(errors);
            return;
          }

          //If the role is Admin
          if (req.role == 2) {
            ProductData.findOne(
              {
                product_colors: {
                  $elemMatch: {
                    $or: [
                      { front_image: image.image },
                      { back_image: image.image },
                      { image: image.image },
                    ],
                  },
                },
                isDeleted: false
              },
              (err, product) => {
                if (err) {
                  var errors = {
                    success: false,
                    msg: err,
                  };
                  res.status(409).send(errors);
                  return;
                }
                if (!product) {
                  var errors = {
                    success: false,
                    msg: "The image product does not exist!",
                  };
                  res.status(409).send(errors);
                  return;
                }

                req.image = image;
                next();
              });
          } 
          //If the role is of Seller
          else if (req.role == 3) {
            SellerProductData.findOne(
              {
                product_colors: {
                  $elemMatch: {
                    $or: [
                      { front_image: image.image },
                      { back_image: image.image },
                      { image: image.image },
                    ],
                  },
                },
                isDeleted: false
              },
              (err, product) => {
                if (err) {
                  var errors = {
                    success: false,
                    msg: err,
                  };
                  res.status(409).send(errors);
                  return;
                }
                if (!product) {
                  var errors = {
                    success: false,
                    msg: "The image product does not exist!",
                  };
                  res.status(409).send(errors);
                  return;
                }

                req.image = image;
                next();
              });
          }
          else {
            var data = {
              success: false,
              msg: "No role defined",
              data: Data,
            };
            res.status(500).send(data);
            return;
          }
        }
      })
  );
}

exports.canChangeImage = canChangeImage;
exports.canDeleteImage = canDeleteImage;
