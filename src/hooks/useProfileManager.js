import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import apiRequest, { resolveAssetUrl } from '../utils/apiClient';

const normaliseDateForInput = (value) => {
  if (!value) return '';
  const instance = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(instance.getTime())) {
    return '';
  }
  const year = instance.getFullYear();
  const month = String(instance.getMonth() + 1).padStart(2, '0');
  const day = String(instance.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toFormState = (user) => ({
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  phoneNumber: user?.phoneNumber ?? '',
  email: user?.email ?? '',
  gender: user?.gender ?? '',
  bio: user?.bio ?? '',
  dateOfBirth: normaliseDateForInput(user?.dateOfBirth),
  addressStreet: user?.addressStreet ?? '',
  addressHouse: user?.addressHouse ?? '',
  addressCity: user?.addressCity ?? '',
  addressState: user?.addressState ?? '',
  addressCountry: user?.addressCountry ?? '',
  profilePhotoUrl: resolveAssetUrl(user?.profilePhotoUrl) ?? null,
});

const trimOrNull = (value) => {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const REQUIRED_FIELDS = ['addressCity', 'addressState', 'addressCountry', 'dateOfBirth'];

const genderOptions = [
  {
    value: 'Stellar Unicorn',
    label: 'Stellar Unicorn',
    emoji: '🦄',
    description: 'Sparkles beyond the binary horizon.',
  },
  {
    value: 'Galactic Explorer',
    label: 'Galactic Explorer',
    emoji: '🚀',
    description: 'Charting identity among the stars.',
  },
  {
    value: 'Forest Guardian',
    label: 'Forest Guardian',
    emoji: '🌲',
    description: 'Rooted, gentle, infinitely strong.',
  },
  {
    value: 'Wave Rider',
    label: 'Wave Rider',
    emoji: '🌊',
    description: 'Fluid, free, and always in motion.',
  },
  {
    value: 'custom',
    label: 'Create Your Own Vibe',
    emoji: '✨',
    description: 'Describe the aura that suits you best.',
  },
];

const deriveSelectedGenderOption = (gender) => {
  if (!gender) {
    return null;
  }
  return genderOptions.some((option) => option.value === gender) ? gender : 'custom';
};

export default function useProfileManager() {
  const { user, fetchUserDetails } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState(() => toFormState(user));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(resolveAssetUrl(user?.profilePhotoUrl) ?? null);
  const [customGender, setCustomGender] = useState(() =>
    user?.gender && !genderOptions.some((option) => option.value === user.gender) ? user.gender : '',
  );
  const [selectedGenderOption, setSelectedGenderOptionState] = useState(() =>
    deriveSelectedGenderOption(user?.gender),
  );

  useEffect(() => {
    setForm(toFormState(user));
    setPreviewUrl(resolveAssetUrl(user?.profilePhotoUrl) ?? null);
    if (user?.gender && !genderOptions.some((option) => option.value === user.gender)) {
      setCustomGender(user.gender);
      setSelectedGenderOptionState('custom');
    } else {
      setCustomGender('');
      setSelectedGenderOptionState(deriveSelectedGenderOption(user?.gender));
    }
  }, [user]);

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    const trimmedFirstName = form.firstName.trim();
    if (!trimmedFirstName) {
      showToast({
        status: 'error',
        title: 'First name is required',
        description: 'Let us know how to address you.',
      });
      return false;
    }

    for (const field of REQUIRED_FIELDS) {
      const value = form[field];
      if (!value || !value.toString().trim()) {
        const labels = {
          addressCity: 'City',
          addressState: 'State / Province',
          addressCountry: 'Country',
          dateOfBirth: 'Date of birth',
        };
        showToast({
          status: 'error',
          title: `${labels[field]} is required`,
          description: 'Please fill in all highlighted info before saving.',
        });
        return false;
      }
    }
    return true;
  }, [form, showToast]);

  const saveProfile = useCallback(async () => {
    if (!validateForm()) {
      return { success: false };
    }

    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: trimOrNull(form.lastName),
        phoneNumber: trimOrNull(form.phoneNumber),
        gender:
          selectedGenderOption === 'custom'
            ? trimOrNull(customGender)
            : trimOrNull(form.gender),
        bio: trimOrNull(form.bio),
        dateOfBirth: form.dateOfBirth || null,
        addressStreet: trimOrNull(form.addressStreet),
        addressHouse: trimOrNull(form.addressHouse),
        addressCity: trimOrNull(form.addressCity),
        addressState: trimOrNull(form.addressState),
        addressCountry: trimOrNull(form.addressCountry),
      };

      const updated = await apiRequest('/users/me', {
        method: 'PATCH',
        body: payload,
      });
      setForm(toFormState(updated));
      setPreviewUrl(resolveAssetUrl(updated?.profilePhotoUrl) ?? null);
      const nextGenderOption = deriveSelectedGenderOption(updated?.gender);
      setSelectedGenderOptionState(nextGenderOption);
      if (nextGenderOption === 'custom') {
        setCustomGender(updated?.gender ?? '');
      } else {
        setCustomGender('');
      }
      await fetchUserDetails();
      showToast({
        status: 'success',
        title: 'Profile saved',
        description: 'Your details are fresh and shiny.',
      });
      return { success: true, data: updated };
    } catch (error) {
      const message = error?.message ?? 'Unable to save profile details.';
      showToast({
        status: 'error',
        title: 'Save failed',
        description: message,
      });
      return { success: false, error };
    } finally {
      setSaving(false);
    }
  }, [customGender, fetchUserDetails, form, selectedGenderOption, showToast, validateForm]);

  const uploadPhoto = useCallback(
    async (file) => {
      if (!file) {
        return { success: false, error: new Error('No file selected') };
      }

      const formData = new FormData();
      formData.append('file', file);

      setUploading(true);
      try {
        const updated = await apiRequest('/users/me/photo', {
          method: 'PATCH',
          body: formData,
        });
        setForm(toFormState(updated));
        setPreviewUrl(resolveAssetUrl(updated?.profilePhotoUrl) ?? null);
        await fetchUserDetails();
        showToast({
          status: 'success',
          title: 'Profile photo updated',
          description: 'Looking good! The new avatar is live.',
        });
        return { success: true, data: updated };
      } catch (error) {
        const message = error?.message ?? 'Unable to upload the profile photo.';
        showToast({
          status: 'error',
          title: 'Upload failed',
          description: message,
        });
        return { success: false, error };
      } finally {
        setUploading(false);
      }
    },
    [fetchUserDetails, showToast],
  );

  const genderValue = useMemo(() => {
    if (selectedGenderOption === 'custom') {
      return customGender;
    }
    return form.gender;
  }, [customGender, form.gender, selectedGenderOption]);

  return {
    form,
    updateField,
    saveProfile,
    saving,
    uploading,
    previewUrl,
    uploadPhoto,
    genderOptions,
    selectedGenderOption,
    setSelectedGenderOption: (option) => {
      setSelectedGenderOptionState(option);
      if (option === 'custom') {
        setCustomGender(form.gender && !genderOptions.some((item) => item.value === form.gender) ? form.gender : '');
        updateField('gender', '');
      } else {
        updateField('gender', option);
        setCustomGender('');
      }
    },
    customGender,
    setCustomGender,
    genderValue,
    refreshFromServer: fetchUserDetails,
  };
}

