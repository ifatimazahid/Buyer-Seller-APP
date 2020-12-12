const Joi = require("joi");
const moment = require("moment");

//************************ VALIDATE USER REGISTER DATA ***********************//
function validateRegisterData(userData) {
  const schema = Joi.object().keys({
    userName: Joi.string().required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(5).required(),
    phoneNo: Joi.number().required(),
    role: Joi.number().valid([1, 2, 3, 4, 5]).required(),
  });
  return Joi.validate(userData, schema);
}

//************************ VALIDATE USER LOGIN DATA ***********************//
function validateLoginData(userData) {
  const schema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(5),
    role: Joi.number(),
    gcm_id: Joi,
    platform: Joi.string(),
  });
  return Joi.validate(userData, schema);
}

//************************ VALIDATE USER PROFILE EDIT DATA ***********************//
const validateUserEditData = async (data) => {
  const schema = Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    bio: Joi.string(),
    userName: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    province: Joi.string(),
    address: Joi.string(),
    phoneNo: Joi.number(),
    gcm_id: Joi.string(),
    postalCode: Joi.number().optional(),
    platform: Joi.string(),
  });
  return Joi.validate(data, schema);
};

//************************ VALIDATE CREATE PRODUCT DATA ***********************//
function validateProductData(data) {
  // const pal = Joi.object().keys({
  //     pallet_id: Joi.number().required(),
  //     pallet_name: Joi.string().required(),
  //     pallet_height: Joi.string().required(),
  //     product_view: Joi.string().required(),
  //     pallet_width: Joi.string().required(),
  //   });
  const sku = Joi.object().keys({
    cost: Joi.number().required(),
    catalog_sku_id: Joi.number().required(),
    mrsp: Joi.number().required(),
    size: Joi.string().required(),
    baseCost: Joi.number().required(),
    in_stock: Joi.number().required(),
    stock: Joi.number().required(),
    startDate: Joi.date().min(moment().startOf("day").toString()).required(),
    // pallet: Joi.array().items(pal),
  }); 
  const product_color = Joi.object().keys({
    color: Joi.string().required(),
    hex: Joi.string().required(),
    front_image: Joi.string().required(),
    back_image: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    product_color_id: Joi.number().required(),
    skus: Joi.array().items(sku),
  }); 
  const schema = Joi.object().keys({
    catalog_product_id: Joi.number().required(),
    product_name: Joi.string().required(),
    description: Joi.string().required(),
    product_description_bullet1: Joi.string().optional().allow(""),
    product_description_bullet2: Joi.string().optional().allow(""),
    product_description_bullet3: Joi.string().optional().allow(""),
    product_description_bullet4: Joi.string().optional().allow(""),
    product_description_bullet5: Joi.string().optional().allow(""),
    category: Joi.array().items(Joi.string()), 
    product_colors: Joi.array().items(product_color),
    custom_cat: Joi.boolean(),
  });
  return Joi.validate(data, schema);
}

//************************ VALIDATE EDIT PRODUCT DATA ***********************//
function validatEditProductData(data) {
  // const pal = Joi.object().keys({
  //     pallet_id: Joi.number().required(),
  //     pallet_name: Joi.string().required(),
  //     pallet_height: Joi.string().required(),
  //     product_view: Joi.string().required(),
  //     pallet_width: Joi.string().required(),
  //   });
  const sku = Joi.object().keys({
    _id: Joi.string(),
    cost: Joi.number().required(),
    catalog_sku_id: Joi.number().required(),
    mrsp: Joi.number().required(),
    size: Joi.string().required(),
    baseCost: Joi.number().required(),
    sellingPrice: Joi.number(),
    profit: Joi.number(),
    in_stock: Joi.number().required(),
    stock: Joi.number().required(),
    startDate: Joi.date().required(),
    // pallet: Joi.array().items(pal),
  }); 
  const product_color = Joi.object().keys({
    _id: Joi.string(),
    color: Joi.string().required(),
    hex: Joi.string().required(),
    front_image: Joi.string().required(),
    back_image: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    product_color_id: Joi.number().required(),
    skus: Joi.array().items(sku),
  }); 
  const schema = Joi.object().keys({
    catalog_product_id: Joi.number().required(),
    product_name: Joi.string().required(),
    description: Joi.string().required(),
    product_description_bullet1: Joi.string().optional().allow(""),
    product_description_bullet2: Joi.string().optional().allow(""),
    product_description_bullet3: Joi.string().optional().allow(""),
    product_description_bullet4: Joi.string().optional().allow(""),
    product_description_bullet5: Joi.string().optional().allow(""),
    category: Joi.array().items(Joi.string()), 
    product_colors: Joi.array().items(product_color),
    custom_cat: Joi.boolean(),
  });
  return Joi.validate(data, schema);
}

//************************ VALIDATE ADD PRODUCT DATA SELLER ***********************//
function validateAddSellerProduct(data) {
  const sku = Joi.object().keys({
    _id: Joi.string(),
    cost: Joi.number().required(),
    catalog_sku_id: Joi.number().required(),
    mrsp: Joi.number().required(),
    size: Joi.string().required(),
    baseCost: Joi.number(),
    in_stock: Joi.number().required(),
    stock: Joi.number(),
    startDate: Joi.date().required()
  });

  const product_color = Joi.object().keys({
    color: Joi.string(),
    hex: Joi.string(),
    front_image: Joi.string().required(),
    back_image: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    product_color_id: Joi.number().required(),
    skus: Joi.array().items(sku),
    _id: Joi.string()
  });
  const product = Joi.object().keys({
    catalog_product_id: Joi.number().required(),
    product_name: Joi.string().required(),
    storeId: Joi.string().required(),
    userId: Joi.string().required(),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
    description: Joi.string().required(),
    product_description_bullet1: Joi.string().optional().allow(""),
    product_description_bullet2: Joi.string().optional().allow(""),
    product_description_bullet3: Joi.string().optional().allow(""),
    product_description_bullet4: Joi.string().optional().allow(""),
    product_description_bullet5: Joi.string().optional().allow(""),
    category: Joi.array(),  
    product_colors: Joi.array().items(product_color),
    custom_cat: Joi.boolean(),
    createdDate: Joi.string(),
    updatedDate: Joi.string(),
    custom_cat: Joi.boolean(), 
    __v: Joi.number(),
    _id: Joi.string()
  });
  const schema = Joi.object().keys({
    products: Joi.array().items(product),
  });
  return Joi.validate(data, schema);
}

//************************ VALIDATE EDIT PRODUCT DATA SELLER ***********************//
function validateEditSellerProduct(data) {
  const sku = Joi.object().keys({
    _id: Joi.string(),
    sellingPrice: Joi.number(),
    profit: Joi.number(),
    isActive: Joi.boolean()
  }); 
  const product_color = Joi.object().keys({
    front_image: Joi.string().required(),
    back_image: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
    product_color_id: Joi.number().required(),
    skus: Joi.array().items(sku),
  }); 
  const schema = Joi.object().keys({
    catalog_product_id: Joi.number().required(),
    product_name: Joi.string().required(),
    description: Joi.string().required(),
    product_colors: Joi.array().items(product_color),
  });
  return Joi.validate(data, schema);
}

//************************ VALIDATE EDIT SKU DATA BY ADMIN ***********************//
function validateEditAdminSku(data) {
  const sku = Joi.object().keys({
    baseCost: Joi.number().required()
  }); 
  return Joi.validate(data, sku);
}


//************************ VALIDATE EDIT SKU DATA BY SELLER ***********************//
function validateEditSku(data) {
  const sku = Joi.object().keys({
    catalog_sku_id: Joi.string(),
    sellingPrice: Joi.number(),
    profit: Joi.number(),
    isActive: Joi.boolean()
  }); 
  return Joi.validate(data, sku);
}


exports.validateProductData = validateProductData;
exports.validatEditProductData = validatEditProductData;
exports.validateAddSellerProduct = validateAddSellerProduct;
exports.validateEditSellerProduct = validateEditSellerProduct;
