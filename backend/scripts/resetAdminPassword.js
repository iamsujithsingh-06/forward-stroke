import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

async function resetAdminPassword() {
  const email = 'sujithsinghsm6@gmail.com';
  const newPassword = 'admin@forwardstroke';

  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found');
    await mongoose.disconnect();
    process.exit(1);
  }

  /*
   * The User model's pre('save') middleware automatically hashes the password
   * using bcrypt with a salt round of 12:
   *
   *   userSchema.pre('save', async function (next) {
   *     if (!this.isModified('password')) return next();
   *     const salt = await bcrypt.genSalt(12);
   *     this.password = await bcrypt.hash(this.password, salt);
   *     next();
   *   });
   *
   * Setting the password on the user document and calling .save() triggers
   * this hook, so we do NOT need to hash manually here.
   */

  user.password = newPassword;
  user.role = 'admin';

  await user.save();

  console.log('Password reset successful');
  await mongoose.disconnect();
  process.exit(0);
}

resetAdminPassword();
