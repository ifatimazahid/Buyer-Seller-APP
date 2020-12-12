const { userroleData } = require("../Models/userRole.model");
var compose = require("composable-middleware");
//Super Admin
function checkAdmin () {
  return (
    compose()
      // Attach user to request
      .use(async function (req, res, next) {
        const role = await userroleData.findOne({ userId: req.user._id });
        if (role == null) {
          var err = {
            success: false,
            msg: "ACCESS DENIED!",
          };
          res.status(401).send(err);
          return;
        }

        if (role.role[0] !== "2") {
          var err = {
            success: false,
            msg: "Access Denied!",
          };
          res.status(401).send(err);
          return false;
        }
        req.role = role.role[0];
        next();
      })
  );
};

//Buyer
function checkBuyer() {
  return (
    compose()
      // Attach user to request
      .use(async function (req, res, next) {
        const role = await userroleData.findOne({ userId: req.user._id });
        if (role == null) {
          var err = {
            success: false,
            msg: "ACCESS DENIED!",
          };
          res.status(401).send(err);
          return;
        }

        if (role.role[0] !== "4") {
          var err = {
            success: false,
            msg: "Access Denied!",
          };
          res.status(401).send(err);
          return false;
        }
        next();
      })
  );
};

//Seller
function checkSeller () {
  return (
    compose()
      // Attach user to request
      .use(async function (req, res, next) {
        const role = await userroleData.findOne({ userId: req.user._id });
        if (role == null) {
          var err = {
            success: false,
            msg: "ACCESS DENIED!",
          };
          res.status(401).send(err);
          return;
        }

        if (role.role[0] !== "3") {
          var err = {
            success: false,
            msg: "Access Denied!",
          };
          res.status(401).send(err);
          return false;
        }
        next();
      })
  );
};

function AdminOrSeller(){
  return (
    compose()
      // Attach user to request
      .use(async function (req, res, next) {
        const role = await userroleData.findOne({ userId: req.user._id });
        if (role == null) {
          var err = {
            success: false,
            msg: "ACCESS DENIED!",
          };
          res.status(401).send(err);
          return;
        }
      
        if (role.role[0] === "4") {
          var err = {
            success: false,
            msg: "Access Denied!",
          };
          res.status(401).send(err);
          return false;
        }
        next();
      })
  );
  
};

function AdminOrBuyer(){
  return (
    compose()
      // Attach user to request
      .use(async function (req, res, next) {
        const role = await userroleData.findOne({ userId: req.user._id });
        if (role == null) {
          var err = {
            success: false,
            msg: "ACCESS DENIED!",
          };
          res.status(401).send(err);
          return;
        }

        if (role.role[0] === "3") {
          var err = {
            success: false,
            msg: "Access Denied!",
          };
          res.status(401).send(err);
          return false;
        }
        next();
      })
  );
};

function SellerOrBuyer(){
  return (
    compose()
      // Attach user to request
      .use(async function (req, res, next) {
        const role = await userroleData.findOne({ userId: req.user._id });
        if (role == null) {
          var err = {
            success: false,
            msg: "ACCESS DENIED!",
          };
          res.status(401).send(err);
          return;
        }

        if (role.role[0] === "2") {
          var err = {
            success: false,
            msg: "Access Denied!",
          };
          res.status(401).send(err);
          return false;
        }
        next();
      })
  );
};

exports.SellerOrBuyer = SellerOrBuyer;
exports.AdminOrBuyer = AdminOrBuyer;
exports.AdminOrSeller = AdminOrSeller;
exports.checkAdmin = checkAdmin;
exports.checkBuyer = checkBuyer;
exports.checkSeller = checkSeller;
