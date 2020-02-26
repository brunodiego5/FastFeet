import User from '../models/User';

export default async (req, res, next) => {
  const { userId } = req.body;

  /* check is admin */
  const checkIsAdmin = await User.findOne({
    where: { id: userId, admin: true },
  });

  if (!checkIsAdmin) {
    return res
      .status(401)
      .json({ error: 'Unauthorized user. Log in as administrator' });
  }
};
