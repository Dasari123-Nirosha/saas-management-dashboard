
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Clock3,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { useApp } from "../context/AppContext";
import { addNotification } from "../utils/notifications";
import { recordActivity } from "../components/dashboard/RecentActivity";

const PAGE_SIZE = 5;

const EMPTY_FORM = {
  name: "",
  email: "",
  role: "User",
  status: "Active",
  company: "",
  joinedAt: new Date().toISOString().slice(0, 10),
};

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function normalizeStatus(status = "") {
  return String(status).toLowerCase();
}

function getUserId(user) {
  return user?.id ?? user?.userId;
}

function formatDate(value) {
  if (!value) return "—";

  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/);

  if (match) {
    const [year, month, day] = match[0].split("-");

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(+year, +month - 1, +day)));
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function Users() {
  const { users = [], addUser, updateUser, deleteUser } = useApp();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(""), 3000);

    return () => clearTimeout(timer);
  }, [notice]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(
        (user) => normalizeStatus(user.status) === "active"
      ).length,
      inactive: users.filter(
        (user) => normalizeStatus(user.status) === "inactive"
      ).length,
      pending: users.filter(
        (user) => normalizeStatus(user.status) === "pending"
      ).length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !search ||
        [
          user.name,
          user.email,
          user.id,
          user.userId,
          user.company,
          user.role,
          user.status,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search)
          );

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        normalizeStatus(user.status) === normalizeStatus(statusFilter);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / PAGE_SIZE)
  );

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  function openCreateModal() {
    setEditingUser(null);
    setForm({
      ...EMPTY_FORM,
      joinedAt: new Date().toLocaleDateString("en-CA"),
    });
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(user) {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "User",
      status: user.status || "Active",
      company: user.company || "",
      joinedAt: String(user.joinedAt || user.joiningDate || "").slice(0, 10),
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingUser(null);
    setForm({ ...EMPTY_FORM });
    setFormError("");
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const company = form.company.trim();
    const joinedAt = form.joinedAt;

    if (!name || !email || !company || !joinedAt) {
      setFormError("Please complete all fields, including joining date.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    const editingId = getUserId(editingUser);

    const duplicateEmail = users.some((user) => {
      const existingId = getUserId(user);

      return (
        String(existingId ?? "") !== String(editingId ?? "") &&
        String(user.email || "").toLowerCase() === email
      );
    });

    if (duplicateEmail) {
      setFormError("A user with this email already exists.");
      return;
    }

    const userData = {
      name,
      email,
      company,
      role: form.role,
      status: form.status,
      joinedAt,
    };

    try {
      if (editingUser) {
        updateUser(editingId, userData);

        recordActivity({
          type: "user",
          title: "User details updated",
          description: `${name}'s account details were updated`,
          path: "/users",
        });

        addNotification({
          title: "User updated",
          message: `${name}'s account details were updated.`,
          section: "Users",
          recordName: name,
        });

        setNotice("User and joining date updated successfully.");
      } else {
        const newUser = {
          ...userData,
          id: `USR-${Date.now()}`,
        };

        addUser(newUser);

        recordActivity({
          type: "user",
          title: "New user registered",
          description: `${name} joined the ${form.role} role`,
          path: "/users",
        });

        addNotification({
          title: "New user registered",
          message: `${name} was added to your platform.`,
          section: "Users",
          recordName: name,
        });

        setNotice("User created successfully.");
        setPage(1);
      }

      closeModal();
    } catch (error) {
      console.error("Unable to save user:", error);
      setFormError("Unable to save this user. Please try again.");
    }
  }

  function handleToggleStatus(user) {
    const currentStatus = normalizeStatus(user.status);

    if (!["active", "inactive"].includes(currentStatus)) return;

    const nextStatus =
      currentStatus === "active" ? "Inactive" : "Active";

    try {
      updateUser(getUserId(user), {
        ...user,
        status: nextStatus,
      });

      recordActivity({
        type: "user",
        title: "User status updated",
        description: `${user.name}'s status changed to ${nextStatus}`,
        path: "/users",
      });

      addNotification({
        title: "User status updated",
        message: `${user.name}'s status changed to ${nextStatus}.`,
        section: "Users",
        recordName: user.name,
      });

      setNotice(`${user.name}'s status changed to ${nextStatus}.`);
    } catch (error) {
      console.error("Unable to update user status:", error);
      setNotice("Unable to update user status.");
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;

    const deletedName = deleteTarget.name || "Unnamed user";

    try {
      deleteUser(getUserId(deleteTarget));

      recordActivity({
        type: "user",
        title: "User deleted",
        description: `${deletedName} was removed from your platform`,
        path: "/users",
      });

      addNotification({
        title: "User deleted",
        message: `${deletedName} was removed from your platform.`,
        section: "Users",
        recordName: deletedName,
      });

      setNotice("User deleted successfully.");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Unable to delete user:", error);
      setNotice("Unable to delete the user.");
    }
  }

  function handleRoleFilter(value) {
    setRoleFilter(value);
    setPage(1);
  }

  function handleStatusFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleSearch(value) {
    setSearchInput(value);
    setPage(1);
  }

  const firstItem =
    filteredUsers.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(page * PAGE_SIZE, filteredUsers.length);

  return (
    <section className="users-page">
      {notice && (
        <div className="users-notice" role="status">
          {notice}
        </div>
      )}

      <header className="page-header">
        <div className="page-header__content">
          <div className="breadcrumbs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Users</span>
          </div>
          <h1>Users</h1>
          <p>Manage your team members, access roles, and account status.</p>
        </div>

        <div className="page-header__actions">
          <button type="button" className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={17} />
            Add user
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <StatCard label="Total users" value={stats.total} icon={<UsersIcon size={20} />} color="purple" />
        <StatCard label="Active users" value={stats.active} icon={<UserCheck size={20} />} color="green" />
        <StatCard label="Inactive users" value={stats.inactive} icon={<UserX size={20} />} color="red" />
        <StatCard label="Pending users" value={stats.pending} icon={<Clock3 size={20} />} color="orange" />
      </div>

      <section className="content-card">
        <div className="content-card__header">
          <div>
            <h2 className="content-card__title">All users</h2>
            <p className="card-subtitle">View and manage user accounts in one place.</p>
          </div>
          <span className="role-badge">
            {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
          </span>
        </div>

        <div className="content-card__body">
          <div className="users-toolbar">
            <label className="search-box">
              <Search size={17} color="#929db0" />
              <input
                type="search"
                placeholder="Search name, email, company..."
                value={searchInput}
                onChange={(event) => handleSearch(event.target.value)}
                aria-label="Search users"
              />
              {searchInput && (
                <button
                  type="button"
                  className="btn-icon"
                  aria-label="Clear search"
                  onClick={() => handleSearch("")}
                >
                  <X size={15} />
                </button>
              )}
            </label>

            <div className="filter-group">
              <select value={roleFilter} onChange={(event) => handleRoleFilter(event.target.value)} aria-label="Filter by role">
                <option value="All">All roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="User">User</option>
              </select>

              <select value={statusFilter} onChange={(event) => handleStatusFilter(event.target.value)} aria-label="Filter by status">
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map((user) => {
                  const normalized = normalizeStatus(user.status);
                  const isToggleable = ["active", "inactive"].includes(normalized);

                  return (
                    <tr key={getUserId(user)}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">{getInitials(user.name)}</div>
                          <div>
                            <div className="user-name">{user.name || "Unnamed user"}</div>
                            <div className="user-email">{user.email || "No email"}</div>
                          </div>
                        </div>
                      </td>

                      <td>{user.company || "—"}</td>

                      <td>
                        <span className="role-badge">{user.role || "User"}</span>
                      </td>

                      <td>
                        {isToggleable ? (
                          <button
                            type="button"
                            className={`status-badge ${normalized === "active" ? "status-active" : "status-inactive"} status-badge--clickable`}
                            onClick={() => handleToggleStatus(user)}
                            aria-label={`Change ${user.name}'s status`}
                            title="Click to change status"
                          >
                            <span aria-hidden="true">●</span>
                            {user.status}
                          </button>
                        ) : (
                          <StatusBadge status={user.status} />
                        )}
                      </td>

                      <td>{formatDate(user.joinedAt || user.joiningDate)}</td>

                      <td>
                        <div className="table-actions">
                          <button type="button" className="btn-icon" title="Edit user" aria-label={`Edit ${user.name}`} onClick={() => openEditModal(user)}>
                            <Pencil size={15} />
                          </button>
                          <button type="button" className="btn-icon" title="Delete user" aria-label={`Delete ${user.name}`} onClick={() => setDeleteTarget(user)} style={{ color: "#d94c5b" }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="empty-state">
                        <div className="empty-state__icon"><UsersIcon size={24} /></div>
                        <h3>No users found</h3>
                        <p>Try changing your search or filters, or add a new user.</p>
                        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
                          <Plus size={16} />
                          Add user
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <div className="pagination-info">
              Showing {firstItem}–{lastItem} of {filteredUsers.length} users
            </div>

            <div className="pagination-controls">
              <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  className={page === pageNumber ? "active" : ""}
                  aria-current={page === pageNumber ? "page" : undefined}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button type="button" aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
            <div className="modal-header">
              <div>
                <h2 className="modal-title" id="user-modal-title">
                  {editingUser ? "Edit user" : "Add new user"}
                </h2>
                <p className="modal-description">
                  {editingUser ? "Update the user account details." : "Enter the details to create a new account."}
                </p>
              </div>
              <button type="button" className="btn-icon" aria-label="Close modal" onClick={closeModal}>
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="user-name">Full name</label>
                  <input id="user-name" name="name" value={form.name} onChange={handleFormChange} placeholder="Enter full name" autoComplete="name" required />
                </div>

                <div className="form-group">
                  <label htmlFor="user-email">Email address</label>
                  <input id="user-email" name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="name@example.com" autoComplete="email" required />
                </div>

                <div className="form-group">
                  <label htmlFor="user-company">Company</label>
                  <input id="user-company" name="company" value={form.company} onChange={handleFormChange} placeholder="Enter company" required />
                </div>

                <div className="form-group">
                  <label htmlFor="user-joinedAt">Joining Date</label>
                  <input id="user-joinedAt" name="joinedAt" type="date" value={form.joinedAt || ""} onChange={handleFormChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="user-role">Role</label>
                  <select id="user-role" name="role" value={form.role} onChange={handleFormChange}>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="user-status">Status</label>
                  <select id="user-status" name="status" value={form.status} onChange={handleFormChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {formError && <p className="form-error" role="alert">{formError}</p>}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? "Save changes" : "Create user"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDeleteTarget(null);
        }}>
          <section className="modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description" style={{ maxWidth: 430 }}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title" id="delete-modal-title">Delete user?</h2>
                <p className="modal-description" id="delete-modal-description">
                  Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                <Trash2 size={15} />
                Delete user
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    purple: { background: "#eeebff", color: "#6758e8" },
    green: { background: "#e6f7ef", color: "#15966b" },
    red: { background: "#fff0f1", color: "#d94c5b" },
    orange: { background: "#fff4dc", color: "#c98520" },
  };

  const style = colors[color] || colors.purple;

  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__icon" style={{ color: style.color, background: style.background }}>
          {icon}
        </span>
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__footer">Current account count</div>
    </article>
  );
}

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status);

  const className =
    normalized === "active"
      ? "status-badge status-active"
      : normalized === "inactive"
        ? "status-badge status-inactive"
        : normalized === "pending"
          ? "status-badge status-pending"
          : "status-badge";

  return (
    <span className={className}>
      <span aria-hidden="true">●</span>
      {status || "Unknown"}
    </span>
  );
}
