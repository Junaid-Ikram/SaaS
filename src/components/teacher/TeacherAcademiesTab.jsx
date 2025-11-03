import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaUniversity,
  FaSignOutAlt,
} from "react-icons/fa";
import { useToast } from "../../contexts/ToastContext";

const statusBadgeClasses = {
  APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  REVOKED: "bg-gray-100 text-gray-600 border-gray-200",
};

const MODAL_LIMIT_COPY = {
  heading: "Academy limit reached",
  body: "You have reached the maximum number of academies you can join. Leave an existing academy to send new requests.",
};

const TeacherAcademiesTab = ({
  memberships = [],
  pendingRequests = [],
  activeAcademyId,
  onSelectAcademy,
  fetchDirectory,
  onJoinAcademy,
  onWithdrawMembership,
  academyLimits,
  loading = false,
}) => {
  const { showToast } = useToast();
  const [directory, setDirectory] = useState([]);
  const [directoryMeta, setDirectoryMeta] = useState(null);
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [directoryError, setDirectoryError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [joinLoadingId, setJoinLoadingId] = useState(null);
  const [withdrawLoadingId, setWithdrawLoadingId] = useState(null);

  const approvedMemberships = useMemo(
    () => memberships.filter((membership) => membership?.status === "APPROVED"),
    [memberships],
  );

  const pendingMemberships = useMemo(
    () => pendingRequests.filter((membership) => membership?.status === "PENDING"),
    [pendingRequests],
  );

  const membershipLookup = useMemo(() => {
    const map = new Map();
    approvedMemberships.forEach((membership) => {
      if (membership?.academyId) {
        map.set(membership.academyId, membership);
      }
    });
    pendingMemberships.forEach((membership) => {
      if (membership?.academyId) {
        map.set(membership.academyId, membership);
      }
    });
    return map;
  }, [approvedMemberships, pendingMemberships]);

  const teacherLimit = academyLimits?.teacher ?? null;
  const totalActiveOrPending = approvedMemberships.length + pendingMemberships.length;
  const hasReachedLimit =
    typeof teacherLimit === "number" && teacherLimit > 0 && totalActiveOrPending >= teacherLimit;

  const loadDirectory = useCallback(
    async (requestedPage = 1, query = searchQuery) => {
      if (typeof fetchDirectory !== "function") {
        return;
      }

      setDirectoryLoading(true);
      setDirectoryError(null);
      try {
        const response = await fetchDirectory({ search: query, page: requestedPage, limit: 9 });
        if (!response?.success) {
          throw response?.error ?? new Error("Unable to load academies.");
        }
        setDirectory(response.data ?? []);
        setDirectoryMeta(response.meta ?? null);
        setPage(requestedPage);
      } catch (error) {
        const message =
          error?.response?.data?.message ?? error?.message ?? "Unable to load academies right now.";
        setDirectoryError(message);
      } finally {
        setDirectoryLoading(false);
      }
    },
    [fetchDirectory, searchQuery],
  );

  useEffect(() => {
    loadDirectory(1, searchQuery);
  }, [searchQuery, loadDirectory]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const handleJoin = async (academyId) => {
    if (!academyId || typeof onJoinAcademy !== "function") {
      return;
    }

    if (hasReachedLimit) {
      showToast({
        status: "warning",
        title: MODAL_LIMIT_COPY.heading,
        description: MODAL_LIMIT_COPY.body,
      });
      return;
    }

    setJoinLoadingId(academyId);
    try {
      const result = await onJoinAcademy(academyId);
      if (result?.success) {
        showToast({
          status: "success",
          title: "Request submitted",
          description: "Your membership request has been sent for review.",
        });
        await loadDirectory(page, searchQuery);
      } else {
        const message =
          result?.error?.response?.data?.message ??
          result?.error?.message ??
          result?.error ??
          "Unable to send membership request.";
        showToast({ status: "error", title: "Request failed", description: message });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ?? error?.message ?? "Unable to send membership request.";
      showToast({ status: "error", title: "Request failed", description: message });
    } finally {
      setJoinLoadingId(null);
    }
  };

  const handleWithdraw = async (membershipId, options = { showSuccess: true }) => {
    if (!membershipId || typeof onWithdrawMembership !== "function") {
      return;
    }

    setWithdrawLoadingId(membershipId);
    try {
      const result = await onWithdrawMembership(membershipId);
      if (result?.success) {
        if (options.showSuccess) {
          showToast({
            status: "success",
            title: "Membership updated",
            description: "The membership has been updated successfully.",
          });
        }
        await loadDirectory(page, searchQuery);
      } else {
        const message =
          result?.error?.response?.data?.message ??
          result?.error?.message ??
          result?.error ??
          "Unable to update membership.";
        showToast({ status: "error", title: "Action failed", description: message });
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ?? error?.message ?? "Unable to update membership.";
      showToast({ status: "error", title: "Action failed", description: message });
    } finally {
      setWithdrawLoadingId(null);
    }
  };

  const renderStatusBadge = (status) => {
    if (!status) {
      return null;
    }
    const badgeClass = statusBadgeClasses[status] ?? statusBadgeClasses.REVOKED;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}>
        {status === "APPROVED" ? (
          <FaCheckCircle className="h-3 w-3" />
        ) : (
          <FaClock className="h-3 w-3" />
        )}
        {status.toLowerCase()}
      </span>
    );
  };

  const renderMembershipCard = (membership) => {
    const academyName = membership?.academy?.name ?? membership?.academyName ?? "Academy";
    const isActive = membership?.academyId === activeAcademyId;
    const membershipId = membership?.id;

    return (
      <div
        key={membershipId ?? membership?.academyId}
        className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-gray-900">{academyName}</p>
            {membership?.academy?.description ? (
              <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                {membership.academy.description}
              </p>
            ) : null}
          </div>
          {renderStatusBadge(membership?.status ?? "APPROVED")}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            Joined on {membership?.requestedAt ? new Date(membership.requestedAt).toLocaleDateString() : "—"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectAcademy?.(membership.academyId)}
              className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium ${
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 cursor-default"
                  : "border-gray-300 text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
              }`}
              disabled={isActive}
            >
              {isActive ? "Active academy" : "Set active"}
            </button>
            <button
              type="button"
              onClick={() => handleWithdraw(membershipId, { showSuccess: true })}
              className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              disabled={withdrawLoadingId === membershipId}
            >
              <FaSignOutAlt className="h-3 w-3" />
              {withdrawLoadingId === membershipId ? "Leaving..." : "Leave"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <header className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Approved academies</h2>
            <p className="text-sm text-gray-500">Select an academy to manage classes and resources.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {approvedMemberships.length} connected
          </span>
        </header>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-500">
            Loading your academies…
          </div>
        ) : approvedMemberships.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            You have not joined any academies yet.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {approvedMemberships.map((membership) => renderMembershipCard(membership))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <header className="flex items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending membership requests</h2>
            <p className="text-sm text-gray-500">Keep an eye on the status of your recent requests.</p>
          </div>
        </header>
        {pendingMemberships.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">No pending requests right now.</div>
        ) : (
          <ul className="mt-4 space-y-3">
            {pendingMemberships.map((membership) => {
              const academyName =
                membership?.academy?.name ?? membership?.academyName ?? "Academy";
              const membershipId = membership?.id;
              return (
                <li
                  key={membershipId ?? membership?.academyId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                >
                  <div>
                    <p className="font-medium">{academyName}</p>
                    <p className="text-xs text-amber-700">
                      Requested on {membership?.requestedAt ? new Date(membership.requestedAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(membership?.status ?? "PENDING")}
                    <button
                      type="button"
                      onClick={() => handleWithdraw(membershipId, { showSuccess: false })}
                      className="inline-flex items-center rounded-md border border-amber-400 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
                      disabled={withdrawLoadingId === membershipId}
                    >
                      {withdrawLoadingId === membershipId ? "Cancelling…" : "Cancel request"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Explore academies</h2>
            <p className="text-sm text-gray-500">
              Browse academies on the platform and request access to join their teams.
            </p>
            {hasReachedLimit ? (
              <p className="mt-2 text-xs font-medium text-amber-600">
                {MODAL_LIMIT_COPY.body}
              </p>
            ) : null}
          </div>
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-md items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <FaSearch className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
              placeholder="Search by academy name"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            ) : null}
            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Search
            </button>
          </form>
        </header>

        {directoryLoading ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-500">
            Searching academies…
          </div>
        ) : directoryError ? (
          <div className="py-10 text-center text-sm text-red-600">{directoryError}</div>
        ) : directory.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">No academies matched your search.</div>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {directory.map((academy) => {
              const membership = membershipLookup.get(academy.id);
              const membershipId = membership?.id;
              const status = membership?.status ?? null;
              const disabled = Boolean(status) || joinLoadingId === academy.id || withdrawLoadingId === membershipId;
              const label = status
                ? status === "PENDING"
                  ? "Pending"
                  : status === "APPROVED"
                  ? "Joined"
                  : status.toLowerCase()
                : hasReachedLimit
                ? "Limit reached"
                : joinLoadingId === academy.id
                ? "Requesting..."
                : "Request access";

              return (
                <li
                  key={academy.id}
                  className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-emerald-50 p-2 text-emerald-600">
                      <FaUniversity className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{academy.name}</p>
                      {academy.description ? (
                        <p className="mt-1 text-xs text-gray-600 line-clamp-2">{academy.description}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {status === "PENDING" ? (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(membershipId, { showSuccess: false })}
                        className="inline-flex items-center rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-50"
                        disabled={withdrawLoadingId === membershipId}
                      >
                        {withdrawLoadingId === membershipId ? "Cancelling…" : "Cancel request"}
                      </button>
                    ) : null}
                    {status === "APPROVED" ? (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(membershipId, { showSuccess: true })}
                        className="inline-flex items-center rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        disabled={withdrawLoadingId === membershipId}
                      >
                        {withdrawLoadingId === membershipId ? "Leaving…" : "Leave academy"}
                      </button>
                    ) : null}
                    {!status ? (
                      <button
                        type="button"
                        onClick={() => handleJoin(academy.id)}
                        disabled={disabled || hasReachedLimit}
                        className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-white ${
                          disabled || hasReachedLimit
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {label}
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              directoryMeta?.previousPage ? loadDirectory(directoryMeta.previousPage, searchQuery) : null
            }
            disabled={!directoryMeta?.previousPage || directoryLoading}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-xs text-gray-500">
            Page {directoryMeta?.currentPage ?? page} of {directoryMeta?.totalPages ?? 1}
          </p>
          <button
            type="button"
            onClick={() =>
              directoryMeta?.nextPage ? loadDirectory(directoryMeta.nextPage, searchQuery) : null
            }
            disabled={!directoryMeta?.nextPage || directoryLoading}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default TeacherAcademiesTab;

