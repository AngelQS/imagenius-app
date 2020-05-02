/**
 * @module Index Controller
 * @category Modules
 * @subcategory Controllers
 */

// Initialization
/**
 * @namespace indexCtrl
 * @property {method} renderIndex Renders the index page.
 */
const indexCtrl = {};

/**
 * @description Renders the index page.
 * @method renderIndex
 * @param {object} req Express Request object.
 * @param {object} res Express Response object.
 * @param {function} next Express Next middleware function.
 * @returns {undefined} Renders index page.
 */
indexCtrl.renderIndex = (req, res, next) => {
  try {
    return res.render("index");
  } catch (err) {
    return next(err);
  }
};

module.exports = indexCtrl;
