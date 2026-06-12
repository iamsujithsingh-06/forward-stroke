const ADMIN_EMAIL = 'sujithsinghsm@gmail.com';

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin' || req.user.email !== ADMIN_EMAIL) {
    return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
  }
  next();
}
