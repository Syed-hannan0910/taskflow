import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getInitials } from '../utils/helpers';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: '', bio: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [pwErrors, setPwErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', bio: user.bio || '' });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const { data } = await profileAPI.get();
      setStats(data.stats);
    } catch {}
  };

  const validateProfile = () => {
    const e = {};
    if (!profileForm.name.trim()) e.name = 'Name is required';
    else if (profileForm.name.trim().length < 2) e.name = 'Name too short';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validatePassword = () => {
    const e = {};
    if (!passwordForm.currentPassword) e.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) e.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 8) e.newPassword = 'At least 8 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setPwErrors(e);
    return !Object.keys(e).length;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setLoading(true);
    try {
      const { data } = await profileAPI.update({ name: profileForm.name.trim(), bio: profileForm.bio.trim() });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setPwLoading(true);
    try {
      await profileAPI.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 space-y-8 animate-fade-in">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Profile</h1>
            <p className="text-slate-400 mt-1">Manage your account settings</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Avatar + Stats */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-3xl font-bold text-white shadow-2xl shadow-blue-500/30 mb-4">
                  {getInitials(user?.name)}
                </div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-slate-400 text-sm mt-1">{user?.email}</p>
                {user?.bio && <p className="text-slate-300 text-sm mt-3 italic">"{user.bio}"</p>}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-500">Member since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'N/A'}</p>
                </div>
              </div>

              {/* Task Stats */}
              {stats && (
                <div className="glass rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-white text-sm">Task Statistics</h3>
                  {[
                    { label: 'Total', value: (stats.todo || 0) + (stats['in-progress'] || 0) + (stats.completed || 0), color: 'text-blue-400' },
                    { label: 'To Do', value: stats.todo || 0, color: 'text-slate-400' },
                    { label: 'In Progress', value: stats['in-progress'] || 0, color: 'text-amber-400' },
                    { label: 'Completed', value: stats.completed || 0, color: 'text-emerald-400' },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">{s.label}</span>
                      <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Edit Profile */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-5">Edit Profile</h3>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <Input label="Full Name" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} error={errors.name} placeholder="Your name" />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300">Bio</label>
                    <textarea
                      className="input-field resize-none h-24 text-sm"
                      placeholder="Tell us a bit about yourself..."
                      value={profileForm.bio}
                      maxLength={200}
                      onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                    />
                    <p className="text-xs text-slate-500 text-right">{profileForm.bio.length}/200</p>
                  </div>
                  <Button type="submit" loading={loading}>Save Changes</Button>
                </form>
              </div>

              {/* Change Password */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-5">Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input label="Current Password" type="password" placeholder="••••••••" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} error={pwErrors.currentPassword} />
                  <Input label="New Password" type="password" placeholder="••••••••" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} error={pwErrors.newPassword} />
                  <Input label="Confirm New Password" type="password" placeholder="••••••••" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} error={pwErrors.confirmPassword} />
                  <Button type="submit" loading={pwLoading} variant="secondary">Update Password</Button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}