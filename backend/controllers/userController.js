export const getUsers = async (req, res, next) => {
  try {
    res.json({ message: 'GET /api/users - placeholder' });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    res.json({ message: `GET /api/users/${req.params.id} - placeholder` });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    res.json({ message: `PUT /api/users/${req.params.id} - placeholder` });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    res.json({ message: `DELETE /api/users/${req.params.id} - placeholder` });
  } catch (err) {
    next(err);
  }
};
