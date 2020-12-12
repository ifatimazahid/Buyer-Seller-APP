const mongoose = require("mongoose");

const sellerProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users"
  },
  admin_product_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "products"
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "stores"
  },
  product_name: {
    type: String,
    required: true
  },
  product_description: {
    type: String,
    required: true
  },
  product_colors: [
    {
      product_color_id: {
        type: Number,
        required: true,
      },
      images: {
        type: [String]
      },
      front_image: {
        type: String
      },
      back_image: {
        type: String
      },
      skus: [
        {
          catalog_sku_id: {
            type: Number,
            required: true
          },
          sellingPrice: {
            type: Number,
            default: 0
          },
          profit: {
            type: Number,
            default: 0
          },
          in_stock: {
            type: Boolean,
            required: true
          },
          isActive: {
            type: Boolean,
            default: false
          }
        }
      ]
    }
  ],
  isActive: {
    type: Boolean,
    default: false
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
});

const SellerProductData = mongoose.model("seller-product", sellerProductSchema);

exports.SellerProductData = SellerProductData;
