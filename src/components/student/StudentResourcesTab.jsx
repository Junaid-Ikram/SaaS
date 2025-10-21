import React from "react";
import ResourcesTab from "../academy/ResourcesTab";

const StudentResourcesTab = ({
  resources,
  loading,
  error,
  onRefresh,
  classes,
}) => {
  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <ResourcesTab
        resources={resources}
        classes={classes}
        loading={loading}
        onRefreshResources={onRefresh}
        canManage={false}
      />
    </div>
  );
};

export default StudentResourcesTab;

