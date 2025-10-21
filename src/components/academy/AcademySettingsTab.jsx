import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaSave, FaUndo, FaSyncAlt } from "react-icons/fa";

const TOGGLE_FIELDS = [
  {
    key: "allowTeacherSelfRegistration",
    label: "Allow teacher self-registration",
    description:
      "When enabled, teachers can request access without a manual invite.",
  },
  {
    key: "autoApproveStudents",
    label: "Auto approve students",
    description:
      "Automatically activate new student registrations without manual review.",
  },
  {
    key: "notifyOwnerOnNewRegistration",
    label: "Notify owner on new registrations",
    description:
      "Send an email notification whenever a teacher or student joins the academy.",
  },
  {
    key: "requireZoomPassword",
    label: "Require Zoom passwords",
    description:
      "Force generated Zoom meetings to include a password by default.",
  },
];

const AcademySettingsTab = ({
  settings,
  loading,
  saving,
  error,
  onRefresh,
  onSubmit,
}) => {
  const initialForm = useMemo(
    () => ({
      allowTeacherSelfRegistration: settings.allowTeacherSelfRegistration,
      autoApproveStudents: settings.autoApproveStudents,
      notifyOwnerOnNewRegistration: settings.notifyOwnerOnNewRegistration,
      requireZoomPassword: settings.requireZoomPassword,
      defaultClassDurationMinutes: settings.defaultClassDurationMinutes,
    }),
    [settings],
  );

  const [formValues, setFormValues] = useState(initialForm);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setFormValues(initialForm);
    setDirty(false);
  }, [initialForm]);

  const handleToggle = (key) => {
    setFormValues((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setDirty(true);
      return next;
    });
  };

  const handleNumberChange = (event) => {
    const value = Number(event.target.value);
    setFormValues((prev) => {
      const next = {
        ...prev,
        defaultClassDurationMinutes: Number.isFinite(value)
          ? value
          : prev.defaultClassDurationMinutes,
      };
      setDirty(true);
      return next;
    });
  };

  const handleReset = () => {
    setFormValues(initialForm);
    setDirty(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dirty || saving) {
      return;
    }
    await onSubmit?.(formValues);
    setDirty(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <span>Loading academy preferences...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key="academy-settings"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-gray-900">
          Academy Preferences
        </h2>
        <p className="text-sm text-gray-600">
          Configure onboarding rules, automation, and Zoom defaults specific to
          your academy.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {TOGGLE_FIELDS.map((field) => (
            <label
              key={field.key}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                checked={formValues[field.key]}
                onChange={() => handleToggle(field.key)}
              />
              <span>
                <span className="text-sm font-semibold text-gray-900">
                  {field.label}
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  {field.description}
                </span>
              </span>
            </label>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">
            Default class duration
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Used when teachers create new Zoom classes from the dashboard.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="number"
              min={15}
              max={360}
              step={5}
              value={formValues.defaultClassDurationMinutes}
              onChange={handleNumberChange}
              className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-600">minutes</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
          >
            <FaSyncAlt className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaUndo className="h-4 w-4" />
            Reset
          </button>
          <button
            type="submit"
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaSave className="h-4 w-4" />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AcademySettingsTab;
