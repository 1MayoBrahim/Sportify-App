const getLoginSession = (req, res) => {
  console.log(req.session);

  if (req.session.currentUser) {
    res.status(200).json({
      status: 200,
      result: req.session.currentUser,
      message: "express-session has obtained current user data",
    });
  } else {
    res.status(404).json({
      status: 404,
      result: null,
      message: "No user data stored in express-session",
    });
  }
};

const postLoginSession = (req, res) => {
  const currentUser = req.body;

  if (currentUser) {
    res.status(400).json({
      status: 400,
      result: currentUser,
      message: "There is already user data in express-session",
    });
  } else {
    currentUser = currentUser;
    res.status(200).json({
      status: 200,
      result: currentUser,
      message: "Current user data added to express-session",
    });
  }
};

const deleteLoginSession = (req, res) => {
  req.session.destroy();

  res.status(200).json({
    status: 200,
    result: null,
    message: "Current user data deleted from express-session",
  });
};

module.exports = { getLoginSession, postLoginSession, deleteLoginSession };
