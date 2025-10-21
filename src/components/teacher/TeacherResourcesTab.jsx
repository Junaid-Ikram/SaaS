import React from "react";
import ResourcesTab from "../academy/ResourcesTab";

const TeacherResourcesTab = ({
  resources,
  loading,
  error,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
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
        onUploadResource={onCreate}
        onUpdateResource={onUpdate}
        onDeleteResource={onDelete}
        onRefreshResources={onRefresh}
        canManage
      />
    </div>
  );
};

export default TeacherResourcesTab;
