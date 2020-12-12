const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "stores",
  },
  catalog_product_id: {             //match
    type: Number,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  product_description_bullet1: String,
  product_description_bullet2: String,
  product_description_bullet3: String,
  product_description_bullet4: String,
  product_description_bullet5: String,
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
  ],
  product_colors: [
    {
      color: {
        type: String,
        required: true,
      },
      hex: {
        type: String,
        required: true,
      },
      front_image: {
        type: String,
        required: true,
      },
      back_image: {
        type: String,
        required: true,
      },
      product_color_id: {         //match
        type: Number,
        required: true,
      }, 
      images: {
        type: [String]
      },
      skus: [
        {
          cost: {
            type: Number,
            required: true,
          },
          catalog_sku_id: {         //match
            type: Number,
            required: true,
          },
          mrsp: {
            type: Number,
            required: true,
          },
          size: {
            type: String,
            required: true,
          },
          baseCost: {
            type: Number,
            required: true,
          },
          in_stock: {
            // Boolean for stock availability
            type: Number,
            required: true,
          },
          startDate: {
            type: Date,
            required: true,
          },
          stock: {
            type: Number,
            required: true,
          },
          // pallet: [
          //   {
          //     pallet_id: {
          //       type: Number,
          //       required: true,
          //     },
          //     pallet_name: {
          //       type: String,
          //       required: true,
          //     },
          //     pallet_height: {
          //       type: String,
          //       required: true,
          //     },
          //     product_view: {
          //       type: String,
          //       required: true,
          //     },
          //     pallet_width: {
          //       type: String,
          //       required: true,
          //     },
          //   },
          // ],
        },
      ],
    },
  ],
  custom_cat: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  status: {
    type: Number, // 1 = Admin, 2 = Seller
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const ProductData = mongoose.model("product", productSchema);

exports.ProductData = ProductData;
