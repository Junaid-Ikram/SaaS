import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaExclamationTriangle, FaInfoCircle, FaRegPaperPlane } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const OwnerOnboardingGate = () => {
  const {
    ownerAcademy,
    ownerAcademyStatus,
    submitAcademyOnboarding,
    refreshAcademyContext,
    fetchUserDetails,
    loadingAcademies,
  } = useAuth();
  const deriveInitialValues = useCallback(() => {
    if (!ownerAcademy || !ownerAcademy.profileCompleted) {
      return { name: "", description: "" };
    }
    return {
      name: ownerAcademy.name ?? "",
      description: ownerAcademy.description ?? "",
    };
  }, [ownerAcademy]);

  const [formData, setFormData] = useState(deriveInitialValues);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  useEffect(() => {
    setFormData(deriveInitialValues());
  }, [deriveInitialValues]);

  const isFormDisabled = useMemo(() => {
    return ownerAcademyStatus === "pending";
  }, [ownerAcademyStatus]);
  const isRefreshPending = refreshingStatus || loadingAcademies;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRefreshStatus = async () => {
    if (isRefreshPending) {
      return;
    }

    try {
      setRefreshingStatus(true);
      const contextResult =
        typeof refreshAcademyContext === "function"
          ? await refreshAcademyContext()
          : null;
      if (typeof fetchUserDetails === "function") {
        await fetchUserDetails();
      }
      if (contextResult?.success === false) {
        const message =
          contextResult.error?.message ??
          contextResult.error?.payload?.message ??
          contextResult.error?.response?.data?.message ??
          "Unable to refresh academy status right now.";
        setFeedback({
          type: "error",
          message,
          source: "refresh",
        });
      } else {
        setFeedback((previous) => {
          if (previous?.source === "submit") {
            return previous;
          }
          return {
            type: "success",
            message:
              "Fetched the latest academy status. This screen will close automatically once approval is complete.",
            source: "refresh",
          };
        });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Unable to refresh academy status right now.";
      setFeedback({
        type: "error",
        message,
        source: "refresh",
      });
    } finally {
      setRefreshingStatus(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ type: "error", message: "Please provide a name for your academy.", source: "submit" });
      return;
    }
    setSubmitting(true);
    setFeedback(null);
    const result = await submitAcademyOnboarding(formData);
    if (result.success) {
      setFeedback({
        type: "success",
        message: "Your onboarding details were submitted for review.",
        source: "submit",
      });
    } else {
      const message =
        result.error?.response?.data?.message ??
        result.error?.message ??
        "Unable to submit your academy details right now.";
      setFeedback({ type: "error", message, source: "submit" });
    }
    setSubmitting(false);
  };

  const renderPendingState = () => (
    <div className="max-w-3xl mx-auto rounded-2xl border border-amber-200 bg-white/70 p-8 text-center shadow-sm backdrop-blur">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <FaInfoCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900">Onboarding in review</h2>
      <p className="mt-3 text-sm text-gray-600">
        We&apos;re reviewing the details for{" "}
        <span className="font-medium text-gray-900">
          {ownerAcademy?.profileCompleted ? ownerAcademy?.name : "your academy"}
        </span>.
        You&apos;ll receive an email once a super admin approves the submission.
      </p>
      <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-5 text-left text-sm text-gray-700">
        <p className="font-medium text-gray-900">Submitted profile</p>
        <p className="mt-1 text-gray-700">
          <span className="font-semibold">Academy name:</span>{" "}
          {ownerAcademy?.profileCompleted ? ownerAcademy?.name : "Awaiting submission"}
        </p>
        <p className="mt-1 text-gray-700">
          <span className="font-semibold">Description:</span>{" "}
          {ownerAcademy?.profileCompleted
            ? ownerAcademy?.description?.trim() || "Awaiting description."
            : "Awaiting description."}
        </p>
      </div>
      <button
        type="button"
        className="mt-6 inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        onClick={handleRefreshStatus}
        disabled={isRefreshPending}
      >
        {isRefreshPending ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
            Refreshing...
          </span>
        ) : (
          "Refresh status"
        )}
      </button>
      {feedback?.source === "refresh" ? (
        <p
          className={`mt-3 text-sm ${feedback.type === "error" ? "text-red-600" : "text-emerald-600"}`}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );

  if (ownerAcademyStatus === "unknown") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-primary-500" />
        <p className="mt-4 text-sm text-gray-500">Preparing your onboarding workspace...</p>
      </div>
    );
  }

  if (ownerAcademyStatus === "pending") {
    return (
      <div className="min-h-[80vh] bg-gradient-to-b from-white to-emerald-50 px-4 py-16">
        {renderPendingState()}
      </div>
    );
  }

  const isRejected = ownerAcademyStatus === "rejected";
  const title =
    ownerAcademyStatus === "missing"
      ? "Set up your academy profile"
      : "Update and resubmit your academy profile";
  const helperText =
    ownerAcademyStatus === "missing"
      ? "Tell us about your academy so a super admin can approve access to the dashboard."
      : "Review the feedback below, adjust your academy profile, and resubmit for approval.";

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-white to-emerald-50 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl backdrop-blur">
        <div className="mb-8">
          <p className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
            Academy onboarding
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{helperText}</p>
        </div>

        {isRejected && ownerAcademy?.rejectionReason ? (
          <div className="mb-8 rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-800">
            <div className="mb-2 flex items-center font-semibold">
              <FaExclamationTriangle className="mr-2 h-4 w-4" />
              Submission rejected
            </div>
            <p>{ownerAcademy.rejectionReason}</p>
          </div>
        ) : null}

        {feedback ? (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Academy name<span className="text-red-500">*</span>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="e.g., Bright Minds Learning Hub"
                disabled={isFormDisabled || submitting}
              />
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Share how your academy operates, who you serve, and anything else reviewers should know."
                disabled={isFormDisabled || submitting}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-secondary-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaRegPaperPlane className="mr-2 h-4 w-4" />
            {submitting ? "Submitting..." : "Submit for approval"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerOnboardingGate;









