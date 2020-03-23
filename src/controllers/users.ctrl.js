const usersCtrl = {};

usersCtrl.renderSignUpForm = (req, res) => {
  res.render('signup');
};

usersCtrl.signUp = (req, res, next) => {
  try {
    const result = req.body;
    console.log('req.body: ', req.body);
    res.send(JSON.stringify(req.body));
  } catch (err) {
    next(err);
  }
};

module.exports = usersCtrl;
