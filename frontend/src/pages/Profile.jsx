import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import Loading from '../components/Loading';
import Error from '../components/Error';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    authService
      .getProfile()
      .then((res) => setProfile(res.user))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Loading fullPage text="Loading profile..." />;
  if (error) return <Error message={error} />;
  if (!profile) return <Error message="Unable to load profile." />;

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="section-heading">My Profile</h1>
      <p className="section-subheading mb-8">Your account details</p>

      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-surface-200 dark:border-surface-700">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <span className="text-2xl font-display font-bold text-primary-600 dark:text-primary-400">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">{profile.name}</h2>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 capitalize">
              {profile.role}
            </span>
          </div>
        </div>

        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-surface-500 dark:text-surface-400">Name</dt>
            <dd className="mt-1 text-surface-900 dark:text-white">{profile.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-surface-500 dark:text-surface-400">Email</dt>
            <dd className="mt-1 text-surface-900 dark:text-white">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-surface-500 dark:text-surface-400">Role</dt>
            <dd className="mt-1 text-surface-900 dark:text-white capitalize">{profile.role}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
