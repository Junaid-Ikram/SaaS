import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import apiRequest from "../../utils/apiClient";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import Pagination from "../../components/common/Pagination";
import SuperAdminLayout from "../../components/super-admin/SuperAdminLayout";

const statusOptions = [
  { value: "ALL", label: "All statuses" },
  { value: "APPROVED", label: "Approved" },
  { value: "PENDING", label: "Pending" },
  { value: "REJECTED", label: "Rejected" },
];

const numberFormatter = new Intl.NumberFormat("en-US");

const AcademySummaryCard = ({ label, value, accent }) => (
  <div className="rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm">
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-gray-800">
      {numberFormatter.format(value)}
      {accent ? (
        <span className="ml-2 text-sm font-medium text-gray-500">{accent}</span>
      ) : null}
    </p>
  </div>
);

const SuperAdminAcademiesPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch]);

  useEffect(() => {
    let active = true;

    const fetchAcademies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        });

        if (status !== "ALL") {
          params.append("status", status);
        }
        if (debouncedSearch) {
          params.append("search", debouncedSearch);
        }

        const response = await apiRequest(`/users/admins?${params.toString()}`);

        if (!active) return;

        setData(response?.data ?? []);
        setMeta(response?.meta ?? null);
        setSummary(response?.summary ?? null);
        setError(null);
      } catch (err) {
        console.error("Failed to load academy directory", err);
        if (active) {
          setError(err?.message ?? "Failed to load academies");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAcademies();

    return () => {
      active = false;
    };
  }, [page, pageSize, status, debouncedSearch]);

  const totalAcademies = meta?.total ?? 0;

  const statusSummary = useMemo(() => {
    if (!summary) {
      return [];
    }
    return [
      { label: "Approved", value: summary.approved },
      { label: "Pending", value: summary.pending },
      { label: "Rejected", value: summary.rejected },
      { label: "Inactive", value: summary.inactive },
    ];
  }, [summary]);

  const renderStatusBadge = (value) => {
    const base = "inline-flex rounded-full px-3 py-1 text-xs font-semibold";
    if (value === "APPROVED") {
      return (
        <span className={`${base} bg-green-100 text-green-700`}>Approved</span>
      );
    }
    if (value === "PENDING") {
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>
      );
    }
    if (value === "REJECTED") {
      return (
        <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>
      );
    }
    return <span className={`${base} bg-gray-100 text-gray-600`}>{value}</span>;
  };

  return (
    <SuperAdminLayout>
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">
            Academy Management
          </h1>
          <p className="mt-2 text-gray-600">
            Track academy onboarding, approval status, and platform utilisation
            in real time.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AcademySummaryCard
            label="Total academies"
            value={totalAcademies}
            accent={
              summary
                ? `${numberFormatter.format(summary.pending)} pending`
                : ""
            }
          />
          {statusSummary.map((item) => (
            <AcademySummaryCard
              key={item.label}
              label={item.label}
              value={item.value ?? 0}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg border border-gray-100 bg-white shadow-sm"
        >
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Academy Directory
                </h2>
                <p className="text-sm text-gray-500">
                  {totalAcademies
                    ? `${numberFormatter.format(totalAcademies)} academy owner accounts`
                    : "All registered academy owners."}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or email"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:w-64"
                />
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:w-48"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error ? (
            <div className="px-6 py-10">
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                          Loading academies…
                        </td>
                      </tr>
                    ) : data.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                          No academy owners match your filters yet.
                        </td>
                      </tr>
                    ) : (
                      data.map((academy) => (
                        <tr key={academy.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {[academy.firstName, academy.lastName]
                              .filter(Boolean)
                              .join(" ") || academy.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {academy.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            {renderStatusBadge(academy.status)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {academy.phoneNumber ?? "—"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {academy.createdAt
                              ? new Date(academy.createdAt).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 pb-6">
                <Pagination
                  page={meta?.currentPage ?? 1}
                  totalPages={meta?.totalPages ?? 0}
                  totalItems={meta?.total ?? 0}
                  pageSize={pageSize}
                  onPageChange={(nextPage) => setPage(nextPage)}
                  onPageSizeChange={(size) => setPageSize(size)}
                />
              </div>
            </>
          )}
        </motion.div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminAcademiesPage;
