
import {
  Eye,
  Pencil,
  Trash2,
  Mail,
  Users,
} from "lucide-react";

import Table from "../common/Table";
import StatusBadge from "../common/StatusBadge";

function UserTable({
  users = [],
  onView,
  onEdit,
  onDelete,
  loading = false,
}) {
  const columns = [
    {
      key: "user",
      label: "USER",
      render: (_, user) => (
        <div className="user-table__profile">
          <div className="user-table__avatar">
            {(user.name || "U")
              .trim()
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="user-table__identity">
            <span className="user-table__name">
              {user.name || "Unknown User"}
            </span>
            <span className="user-table__email">
              <Mail size={13} />
              {user.email || "No email"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "ROLE",
      render: (value) => (
        <span className="user-table__role">
          {value || "User"}
        </span>
      ),
    },
    {
      key: "plan",
      label: "PLAN",
      render: (value, user) => (
        <span className="user-table__plan">
          {value || user.planName || "Free"}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (value) => (
        <StatusBadge status={value || "active"} />
      ),
    },
    {
      key: "createdAt",
      label: "JOINED",
      render: (value) => {
        if (!value) return "—";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
          ? value
          : date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });
      },
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (_, user) => (
        <div className="user-table__actions">
          {onView && (
            <button
              type="button"
              className="user-table__action"
              title="View user"
              aria-label={`View ${user.name || "user"}`}
              onClick={(event) => {
                event.stopPropagation();
                onView(user);
              }}
            >
              <Eye size={16} />
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              className="user-table__action"
              title="Edit user"
              aria-label={`Edit ${user.name || "user"}`}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(user);
              }}
            >
              <Pencil size={16} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              className="user-table__action user-table__action--danger"
              title="Delete user"
              aria-label={`Delete ${user.name || "user"}`}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(user);
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="user-table__message">
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="user-table__empty">
        <Users size={32} />
        <h3>No users found</h3>
        <p>Users will appear here when they are available.</p>
      </div>
    );
  }

  return (
    <div className="user-table">
      <Table
        columns={columns}
        data={users}
        rowKey={(user) => user.id ?? user.userId ?? user.email}
        emptyMessage="No users found"
        className="user-table__data"
      />
    </div>
  );
}

export default UserTable;