import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const DirectoryCard = ({ academy, status, onRequest, loading }) => {
  const { id, name, description, createdAt } = academy;
  const joined = status === "joined";
  const pending = status === "pending";

  const actionLabel = joined ? "Joined" : pending ? "Pending approval" : "Request access";

  return (
    <motion.div
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      {description ? (
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{description}</p>
      ) : (
        <p className="mt-2 text-sm text-gray-500 italic">No description provided.</p>
      )}
      <p className="mt-3 text-xs text-gray-400">
        Created {new Date(createdAt ?? Date.now()).toLocaleDateString()}
      </p>
      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          className={`inline-flex items-center rounded-md px-3 py-2 text-xs font-semibold ${
            joined
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : pending
              ? "border border-amber-200 bg-amber-50 text-amber-700"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          } disabled:cursor-not-allowed disabled:opacity-60`}
          onClick={() => onRequest(id)}
          disabled={joined || pending || loading}
        >
          {loading ? "Submitting..." : actionLabel}
        </button>
      </div>
    </motion.div>
  );
};

const AcademyDirectory = () => {
  const {
    fetchAcademies,
    requestAcademyMembership,
    academyMemberships,
    pendingAcademyRequests,
  } = useAuth();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState(null);
  const [academies, setAcademies] = useState([]);

  const membershipIds = useMemo(
    () => new Set((academyMemberships ?? []).map((membership) => membership.academyId)),
    [academyMemberships],
  );
  const pendingIds = useMemo(
    () => new Set((pendingAcademyRequests ?? []).map((membership) => membership.academyId)),
    [pendingAcademyRequests],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAcademies({ search });
      if (result?.success) {
        setAcademies(result.data ?? []);
      } else {
        setError("Unable to load academies. Please try again.");
      }
    } catch (err) {
      console.error("Directory load failed", err);
      setError("Unable to load academies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchAcademies, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRequest = useCallback(
    async (academyId) => {
      if (!academyId) {
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
        } else {
          const message =
            result?.error instanceof Error ? result.error.message : "Unable to submit request.";
          showToast({
            status: "error",
            title: "Request failed",
            description: message,
          });
        }
      } catch (err) {
        console.error("Membership request failed", err);
        showToast({
          status: "error",
          title: "Request failed",
          description: "Please try again later.",
        });
      } finally {
        setActionId(null);
      }
    },
    [requestAcademyMembership, showToast],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Academy Directory</h2>
          <p className="text-sm text-gray-600">
            Explore academies and request access to join their classes and resources.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search academies"
            className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={load}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12 text-sm text-gray-500">
            Loading academies...
          </div>
        ) : academies.length === 0 ? (
          <div className="col-span-full rounded-md border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
            No academies match your search yet.
          </div>
        ) : (
          academies.map((academy) => {
            const status = membershipIds.has(academy.id)
              ? "joined"
              : pendingIds.has(academy.id)
              ? "pending"
              : "available";
            return (
              <DirectoryCard
                key={academy.id}
                academy={academy}
                status={status}
                onRequest={handleRequest}
                loading={actionId === academy.id}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default AcademyDirectory;
