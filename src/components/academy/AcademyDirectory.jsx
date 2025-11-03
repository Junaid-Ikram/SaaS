import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaUniversity,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const statusStyles = {
  APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  REVOKED: "bg-gray-100 text-gray-600 border-gray-200",
};

const AcademyDirectory = () => {
  const {
    fetchAcademies,
    requestAcademyMembership,
    withdrawAcademyMembership,
    academyMemberships,
    pendingAcademyRequests,
    academyLimits,
    loadingAcademies,
  } = useAuth();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [directory, setDirectory] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  const approvedMembership = useMemo(
    () => (academyMemberships ?? [])[0] ?? null,
    [academyMemberships],
  );
  const pendingMembership = useMemo(
    () => (pendingAcademyRequests ?? [])[0] ?? null,
    [pendingAcademyRequests],
  );

  const activeMembership = approvedMembership ?? pendingMembership ?? null;
  const studentLimit = academyLimits?.student ?? 1;
  const hasSlot = !studentLimit || studentLimit <= 0 || !activeMembership;

  const membershipLookup = useMemo(() => {
    const map = new Map();
    (academyMemberships ?? []).forEach((membership) => {
      if (membership?.academyId) {
        map.set(membership.academyId, membership);
      }
    });
    (pendingAcademyRequests ?? []).forEach((membership) => {
      if (membership?.academyId) {
        map.set(membership.academyId, membership);
      }
    });
    return map;
  }, [academyMemberships, pendingAcademyRequests]);

  const load = useCallback(
    async (requestedPage = 1, query = searchQuery) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAcademies({
          search: query,
          page: requestedPage,
          limit: 9,
        });
        if (result?.success) {
          setDirectory(result.data ?? []);
          setMeta(result.meta ?? null);
          setPage(requestedPage);
        } else {
          throw result?.error ?? new Error("Unable to load academies.");
        }
      } catch (err) {
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Unable to load academies.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [fetchAcademies, searchQuery],
  );

  useEffect(() => {
    load(1, searchQuery);
  }, [searchQuery, load]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(search.trim());
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchQuery("");
  };

  const handleRequest = async (academyId) => {
    if (!academyId) {
      return;
    }

    if (!hasSlot) {
      showToast({
        status: "warning",
        title: "Limit reached",
        description:
          "You can only have one active academy at a time. Leave or cancel your current request to continue.",
      });
      return;
    }

    setActionId(academyId);
    try {
      const result = await requestAcademyMembership(academyId);
      if (result?.success) {
        showToast({
          status: "success",
          title: "Request submitted",
          description: "The academy owner has been notified of your request.",
        });
        load(page, searchQuery);
      } else {
        const message =
          result?.error?.response?.data?.message ??
          result?.error?.message ??
          result?.error ??
          "Unable to submit request.";
        showToast({
          status: "error",
          title: "Request failed",
          description: message,
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to submit request.";
      showToast({
        status: "error",
        title: "Request failed",
        description: message,
      });
    } finally {
      setActionId(null);
    }
  };

  const handleWithdraw = async (membershipId, successMessage) => {
    if (!membershipId) {
      return;
    }

    setActionId(membershipId);
    try {
      const result = await withdrawAcademyMembership(membershipId);
      if (result?.success) {
        showToast({
          status: "success",
          title: successMessage ?? "Membership updated",
          description: "Your academy access has been updated successfully.",
        });
        load(page, searchQuery);
      } else {
        const message =
          result?.error?.response?.data?.message ??
          result?.error?.message ??
          result?.error ??
          "Unable to update membership.";
        showToast({
          status: "error",
          title: "Action failed",
          description: message,
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to update membership.";
      showToast({
        status: "error",
        title: "Action failed",
        description: message,
      });
    } finally {
      setActionId(null);
    }
  };

  const renderStatusBadge = (status) => {
    if (!status) {
      return null;
    }
    const style = statusStyles[status] ?? statusStyles.REVOKED;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${style}`}>
        {status === "APPROVED" ? (
          <FaCheckCircle className="h-3 w-3" />
        ) : (
          <FaClock className="h-3 w-3" />
        )}
        {status.toLowerCase()}
      </span>
    );
  };

  const renderActionButton = (academy) => {
    const membership = membershipLookup.get(academy.id);
    const status = membership?.status ?? null;
    const membershipId = membership?.id;
    const isPending = status === "PENDING";
    const isJoined = status === "APPROVED";

    if (isPending) {
      return (
        <button
          type="button"
          onClick={() => handleWithdraw(membershipId, "Request cancelled")}
          className="inline-flex items-center gap-1 rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
          disabled={actionId === membershipId}
        >
          {actionId === membershipId ? "Cancelling…" : "Cancel request"}
        </button>
      );
    }

    if (isJoined) {
      return (
        <button
          type="button"
          onClick={() => handleWithdraw(membershipId, "Left academy")}
          className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          disabled={actionId === membershipId}
        >
          <FaTimesCircle className="h-3 w-3" />
          {actionId === membershipId ? "Leaving…" : "Leave academy"}
        </button>
      );
    }

    if (!hasSlot) {
      return (
        <span className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500">
          Limit reached
        </span>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleRequest(academy.id)}
        className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        disabled={actionId === academy.id || loadingAcademies}
      >
        {actionId === academy.id ? "Requesting…" : "Request access"}
      </button>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Academy Directory</h2>
          <p className="text-sm text-gray-600">
            Explore academies and request access to join their classes and resources.
          </p>
          {!hasSlot && activeMembership ? (
            <p className="mt-2 text-xs font-medium text-amber-600">
              You already have an active academy relationship. Leave your current academy or cancel the pending request to join another.
            </p>
          ) : null}
        </div>
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2">
            <FaSearch className="h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search academies"
              className="w-48 bg-transparent text-sm focus:outline-none"
            />
          </div>
          {searchQuery ? (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
            >
              Clear
            </button>
          ) : null}
          <button
            type="submit"
            className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Search
          </button>
        </form>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
            Loading academies...
          </div>
        ) : directory.length === 0 ? (
          <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
            No academies match your search yet.
          </div>
        ) : (
          directory.map((academy) => {
            const status = membershipLookup.get(academy.id)?.status ?? null;
            return (
              <motion.div
                key={academy.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-emerald-50 p-2 text-emerald-600">
                    <FaUniversity className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{academy.name}</h3>
                      {renderStatusBadge(status)}
                    </div>
                    {academy.description ? (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{academy.description}</p>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500 italic">
                        No description provided.
                      </p>
                    )}
                    <p className="mt-3 text-xs text-gray-400">
                      Created {new Date(academy.createdAt ?? Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  {renderActionButton(academy)}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            meta?.previousPage ? load(meta.previousPage, searchQuery) : null
          }
          disabled={!meta?.previousPage || loading}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-xs text-gray-500">
          Page {meta?.currentPage ?? page} of {meta?.totalPages ?? 1}
        </p>
        <button
          type="button"
          onClick={() => (meta?.nextPage ? load(meta.nextPage, searchQuery) : null)}
          disabled={!meta?.nextPage || loading}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AcademyDirectory;

