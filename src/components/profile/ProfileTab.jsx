import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaCheck, FaSpinner } from 'react-icons/fa';
import useProfileManager from '../../hooks/useProfileManager';

const formatInitials = (firstName, lastName) => {
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
  return initials || 'YOU';
};

const ProfileTab = ({ title = 'My Profile', subtitle = 'Keep your personal space updated and expressive.' }) => {
  const {
    form,
    updateField,
    saveProfile,
    saving,
    uploading,
    previewUrl,
    uploadPhoto,
    genderOptions,
    selectedGenderOption,
    setSelectedGenderOption,
    customGender,
    setCustomGender,
    genderValue,
  } = useProfileManager();

  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (file) {
        await uploadPhoto(file);
      }
      event.target.value = '';
    },
    [uploadPhoto],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await saveProfile();
    },
    [saveProfile],
  );

  const genderPreviewLabel = useMemo(() => {
    if (selectedGenderOption === 'custom') {
      return customGender || 'Custom vibe';
    }
    return genderValue || 'Not set';
  }, [customGender, genderValue, selectedGenderOption]);

  return (
    <motion.div
      key="profile-tab"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white shadow-xl ring-1 ring-emerald-50/70"
    >
      <div className="border-b border-emerald-100/70 px-6 py-5 sm:px-10">
        <h2 className="text-2xl font-semibold text-emerald-700">{title}</h2>
        <p className="mt-1 text-sm text-emerald-900/70">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-10 px-6 py-8 sm:px-10 lg:grid-cols-[320px,1fr]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center shadow-inner">
            <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-emerald-200 via-emerald-100 to-emerald-50 shadow-md">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-emerald-600">
                  {formatInitials(form.firstName, form.lastName)}
                </div>
              )}
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/50 text-emerald-50">
                  <FaSpinner className="h-6 w-6 animate-spin" />
                </div>
              ) : null}
            </div>
            <p className="mt-4 text-sm font-medium text-emerald-900">
              {form.firstName ? `Hey ${form.firstName}!` : 'Say hello to your avatar.'}
            </p>
            <p className="mt-1 text-xs text-emerald-900/70">
              Upload a friendly face or your favourite doodle (PNG, JPG, GIF, WebP).
            </p>
            <div className="mt-5 flex flex-col items-center gap-3 text-sm sm:flex-row sm:justify-center">
              <label
                htmlFor="profile-photo-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
              >
                <FaCamera className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Change avatar'}
              </label>
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow">
                  <FaCheck className="h-3 w-3" />
                  Ready for action
                </span>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-inner">
            <h3 className="text-lg font-semibold text-emerald-700">Choose your vibe</h3>
            <p className="mt-1 text-xs text-emerald-900/70">
              Gender is celebrated here. Pick a card or craft your own cosmic description.
            </p>
            <div className="mt-5 grid gap-3">
              {genderOptions.map((option) => {
                const isActive = selectedGenderOption === option.value;
                const isCustom = option.value === 'custom';
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                        : 'border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/70'
                    }`}
                    onClick={() => setSelectedGenderOption(option.value)}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-800">{option.label}</p>
                      <p className="text-xs text-emerald-900/70">{option.description}</p>
                      {isActive && !isCustom ? (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                          <FaCheck className="h-3 w-3" />
                          Selected
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
            {selectedGenderOption === 'custom' ? (
              <div className="mt-4">
                <label htmlFor="customGender" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  Describe your gender vibe
                </label>
                <input
                  id="customGender"
                  type="text"
                  value={customGender}
                  onChange={(event) => setCustomGender(event.target.value)}
                  placeholder="E.g. Cosmic Storyteller"
                  className="mt-1 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            ) : null}
            <p className="mt-4 text-xs text-emerald-900/60">
              Current selection: <span className="font-semibold text-emerald-700">{genderPreviewLabel}</span>
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid gap-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-inner">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(event) => updateField('firstName', event.target.value)}
                  placeholder="First name"
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={(event) => updateField('lastName', event.target.value)}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={form.email}
                  className="mt-1 w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 shadow-inner focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-emerald-900/60">Email keeps your login secure and can&apos;t be edited here.</p>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  Phone number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(event) => updateField('phoneNumber', event.target.value)}
                  placeholder="+1 555 000 0000"
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dateOfBirth" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  Date of birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  required
                  value={form.dateOfBirth}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => updateField('dateOfBirth', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label htmlFor="addressStreet" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  Street
                </label>
                <input
                  id="addressStreet"
                  type="text"
                  value={form.addressStreet}
                  onChange={(event) => updateField('addressStreet', event.target.value)}
                  placeholder="Street name"
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="addressHouse" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  House / apt
                </label>
                <input
                  id="addressHouse"
                  type="text"
                  value={form.addressHouse}
                  onChange={(event) => updateField('addressHouse', event.target.value)}
                  placeholder="Optional"
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label htmlFor="addressCity" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="addressCity"
                  type="text"
                  required
                  value={form.addressCity}
                  onChange={(event) => updateField('addressCity', event.target.value)}
                  placeholder="City"
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label htmlFor="addressState" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  State / province <span className="text-red-500">*</span>
                </label>
                <input
                  id="addressState"
                  type="text"
                  required
                  value={form.addressState}
                  onChange={(event) => updateField('addressState', event.target.value)}
                  placeholder="State or province"
                  className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>
            <div>
              <label htmlFor="addressCountry" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                id="addressCountry"
                type="text"
                required
                value={form.addressCountry}
                onChange={(event) => updateField('addressCountry', event.target.value)}
                placeholder="Country"
                className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div>
              <label htmlFor="bio" className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Mini bio
              </label>
              <textarea
                id="bio"
                value={form.bio}
                onChange={(event) => updateField('bio', event.target.value.slice(0, 1000))}
                maxLength={1000}
                rows={4}
                placeholder="Share your teaching or learning superpowers."
                className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <div className="mt-1 text-right text-[11px] text-emerald-900/60">{form.bio.length}/1000 characters</div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-emerald-800">Save your glow-up</p>
              <p className="text-xs text-emerald-900/70">Required fields are marked with <span className="text-red-500">*</span>.</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {saving ? (
                <>
                  <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save profile'
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileTab;
