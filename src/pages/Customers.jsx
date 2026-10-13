
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  UserX,
} from "lucide-react";
import { addNotification } from "../utils/notifications";
const STORAGE_KEY = "saasflow-customers";
const PAGE_SIZE = 5;

const initialCustomers = [
  { id: 1, name: "Ananya Sharma", email: "ananya@techflow.example", company: "TechFlow Solutions", plan: "Professional", status: "Active", joined: "2026-09-12" },
  { id: 2, name: "Rahul Reddy", email: "rahul@cloudnova.example", company: "CloudNova", plan: "Enterprise", status: "Active", joined: "2026-09-18" },
  { id: 3, name: "Priya Nair", email: "priya@pixelworks.example", company: "PixelWorks", plan: "Starter", status: "Pending", joined: "2026-09-22" },
  { id: 4, name: "Arjun Mehta", email: "arjun@brightlabs.example", company: "BrightLabs", plan: "Growth", status: "Active", joined: "2026-09-25" },
  { id: 5, name: "Sneha Rao", email: "sneha@datawave.example", company: "DataWave Analytics", plan: "Professional", status: "Inactive", joined: "2026-09-28" },
  { id: 6, name: "Vikram Kumar", email: "vikram@nextgenapps.example", company: "NextGen Apps", plan: "Enterprise", status: "Active", joined: "2026-10-01" },
  { id: 7, name: "Meera Iyer", email: "meera@orbitdigital.example", company: "Orbit Digital", plan: "Starter", status: "Pending", joined: "2026-10-04" },
  { id: 8, name: "Karthik Varma", email: "karthik@apexsystems.example", company: "Apex Systems", plan: "Growth", status: "Active", joined: "2026-10-07" },
];

const emptyForm = {
  name: "",
  email: "",
  company: "",
  plan: "Starter",
  status: "Active",
  joined: new Date().toISOString().slice(0, 10),
};

function loadCustomers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load customers:", error);
  }
  return initialCustomers;
}

function Customers() {
  const [customers, setCustomers] = useState(loadCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
      setStorageError("");
    } catch (error) {
      console.error("Unable to save customers:", error);
      setStorageError("Customers could not be saved. Check your browser storage settings.");
    }
  }, [customers]);

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter((c) => c.status === "Active").length,
    inactive: customers.filter((c) => c.status === "Inactive").length,
    pending: customers.filter((c) => c.status === "Pending").length,
  }), [customers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        (customer.name || "").toLowerCase().includes(query) ||
        (customer.email || "").toLowerCase().includes(query) ||
        (customer.company || "").toLowerCase().includes(query);

      return (
        matchesSearch &&
        (statusFilter === "All" || customer.status === statusFilter) &&
        (planFilter === "All" || customer.plan === planFilter)
      );
    });
  }, [customers, search, statusFilter, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const visibleCustomers = filteredCustomers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const notify = (title, message, section, recordName) => {
    try {
      addNotification({ title, message, section, recordName });
    } catch (error) {
      console.error("Unable to create notification:", error);
    }
  };

  const logActivity = (activity) => {
    try {
      recordActivity(activity);
    } catch (error) {
      console.error("Unable to record recent activity:", error);
    }
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name || "",
      email: customer.email || "",
      company: customer.company || "",
      plan: customer.plan || "Starter",
      status: customer.status || "Active",
      joined: String(customer.joined || customer.joinedAt || customer.joinedDate || "").slice(0, 10),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCustomer(null);
    setForm({ ...emptyForm });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const company = form.company.trim();

    if (!name || !email || !company) {
      window.alert("Please fill in all required fields.");
      return;
    }

    const duplicateEmail = customers.some(
      (customer) =>
        customer.email.toLowerCase() === email.toLowerCase() &&
        customer.id !== editingCustomer?.id
    );

    if (duplicateEmail) {
      window.alert("A customer with this email already exists.");
      return;
    }

    if (editingCustomer) {
      const updatedCustomer = {
        ...editingCustomer,
        ...form,
        name,
        email,
        company,
      };

      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === editingCustomer.id ? updatedCustomer : customer
        )
      );

      if (viewCustomer?.id === editingCustomer.id) {
        setViewCustomer(updatedCustomer);
      }

      notify("Customer updated", `${name}'s customer details were updated.`, "Customers", name);

      logActivity({
        type: "success",
        title: "Customer updated",
        description: `${name}'s details were updated.`,
        path: "/customers",
      });
    } else {
      const newCustomer = {
        id: Date.now(),
        ...form,
        name,
        email,
        company,
        joined: new Date().toISOString().slice(0, 10),
      };

      setCustomers((previous) => [newCustomer, ...previous]);
      setCurrentPage(1);

      notify("New customer added", `${name} was added to the customer list.`, "Customers", name);

      logActivity({
        type: "user",
        title: "New customer added",
        description: `${name} joined the ${newCustomer.plan} plan.`,
        path: "/customers",
      });
    }

    closeModal();
  };

  const toggleStatus = (customer) => {
    const nextStatus = customer.status === "Active" ? "Inactive" : "Active";

    setCustomers((previous) =>
      previous.map((item) =>
        item.id === customer.id ? { ...item, status: nextStatus } : item
      )
    );

    if (viewCustomer?.id === customer.id) {
      setViewCustomer({ ...customer, status: nextStatus });
    }

    notify(
      `Customer ${nextStatus.toLowerCase()}`,
      `${customer.name}'s status changed to ${nextStatus}.`,
      "Customers",
      customer.name
    );

    logActivity({
      type: nextStatus === "Active" ? "success" : "error",
      title: `Customer ${nextStatus === "Active" ? "activated" : "deactivated"}`,
      description: `${customer.name}'s account is now ${nextStatus.toLowerCase()}.`,
      path: "/customers",
    });
  };

  const deleteCustomer = (customer) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${customer.name}?`);
    if (!confirmed) return;

    setCustomers((previous) => previous.filter((item) => item.id !== customer.id));

    if (viewCustomer?.id === customer.id) setViewCustomer(null);

    notify("Customer deleted", `${customer.name} was removed from the customer list.`, "Customers", customer.name);

    logActivity({
      type: "error",
      title: "Customer deleted",
      description: `${customer.name} was removed from the customer list.`,
      path: "/customers",
    });
  };

  const exportCustomers = () => {
    const headers = ["ID", "Name", "Email", "Company", "Plan", "Status", "Joined"];

    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredCustomers.map((customer) =>
      [
        customer.id,
        customer.name,
        customer.email,
        customer.company,
        customer.plan,
        customer.status,
        customer.joined,
      ].map(escapeCsv).join(",")
    );

    const csv = [headers.map(escapeCsv).join(","), ...rows].join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "customers.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const initials = (name = "") =>
    name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

  return (
    <main className="customers-page">
      <div className="customers-heading">
        <div>
          <span className="customers-eyebrow">CUSTOMER MANAGEMENT</span>
          <h1>Customers</h1>
          <p>Manage customer accounts, plans, and account status.</p>
        </div>

        <div className="customers-heading-actions">
          <button type="button" className="customers-btn customers-btn-secondary" onClick={exportCustomers}>
            <Download size={17} /> Export CSV
          </button>
          <button type="button" className="customers-btn customers-btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add Customer
          </button>
        </div>
      </div>

      {storageError && <div role="alert" className="customers-storage-error">{storageError}</div>}

      <section className="customers-stats">
        <article className="customer-stat-card">
          <div className="customer-stat-icon purple"><Users size={21} /></div>
          <div><span>Total Customers</span><strong>{stats.total}</strong><small>All customer accounts</small></div>
        </article>
        <article className="customer-stat-card">
          <div className="customer-stat-icon green"><CheckCircle size={21} /></div>
          <div><span>Active</span><strong>{stats.active}</strong><small>Active accounts</small></div>
        </article>
        <article className="customer-stat-card">
          <div className="customer-stat-icon orange"><Clock size={21} /></div>
          <div><span>Pending</span><strong>{stats.pending}</strong><small>Awaiting activation</small></div>
        </article>
        <article className="customer-stat-card">
          <div className="customer-stat-icon red"><UserX size={21} /></div>
          <div><span>Inactive</span><strong>{stats.inactive}</strong><small>Inactive accounts</small></div>
        </article>
      </section>

      <section className="customers-table-card">
        <div className="customers-table-heading">
          <div>
            <h2>All Customers</h2>
            <p>View and manage your customer accounts in one place.</p>
          </div>
          <span className="customers-count">{filteredCustomers.length} customers</span>
        </div>

        <div className="customers-filters">
          <div className="customers-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search name, email, or company..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
            />
            {search && (
              <button type="button" aria-label="Clear search" onClick={() => { setSearch(""); setCurrentPage(1); }}>
                <X size={16} />
              </button>
            )}
          </div>

          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }}>
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>

          <select aria-label="Filter by plan" value={planFilter} onChange={(event) => { setPlanFilter(event.target.value); setCurrentPage(1); }}>
            <option value="All">All plans</option>
            <option value="Starter">Starter</option>
            <option value="Growth">Growth</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>

          {(search || statusFilter !== "All" || planFilter !== "All") && (
            <button type="button" className="customers-reset-btn" onClick={resetFilters}>Reset</button>
          )}
        </div>

        <div className="customers-table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer</th><th>Company</th><th>Plan</th><th>Status</th>
                <th>Joined Date</th><th>Account Toggle</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-identity">
                      <div className="customer-avatar">{initials(customer.name)}</div>
                      <div className="customer-identity-text">
                        <strong>{customer.name}</strong><span>{customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="customer-company">{customer.company}</span></td>
                  <td>
                    <span className={`customer-plan customer-plan-${(customer.plan || "starter").toLowerCase()}`}>
                      {customer.plan}
                    </span>
                  </td>
                  <td>
                    <span className={`customer-status customer-status-${(customer.status || "active").toLowerCase()}`}>
                      <span className="customer-status-dot" />{customer.status}
                    </span>
                  </td>
                  <td className="customer-date">{formatDate(customer.joined)}</td>
                  <td>
                    <button
                      type="button"
                      className={`customer-toggle-btn ${customer.status === "Active" ? "customer-deactivate-btn" : "customer-activate-btn"}`}
                      onClick={() => toggleStatus(customer)}
                      title={customer.status === "Active" ? "Deactivate customer" : "Activate customer"}
                    >
                      {customer.status === "Active" ? <><UserX size={15} /> Deactivate</> : <><CheckCircle size={15} /> Activate</>}
                    </button>
                  </td>
                  <td>
                    <div className="customer-row-actions">
                      <button type="button" className="customer-action-btn view" aria-label={`View ${customer.name}`} title="View customer" onClick={() => setViewCustomer(customer)}><Eye size={17} /></button>
                      <button type="button" className="customer-action-btn edit" aria-label={`Edit ${customer.name}`} title="Edit customer" onClick={() => openEditModal(customer)}><Pencil size={16} /></button>
                      <button type="button" className="customer-action-btn delete" aria-label={`Delete ${customer.name}`} title="Delete customer" onClick={() => deleteCustomer(customer)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleCustomers.length === 0 && (
                <tr><td colSpan={7}>
                  <div className="customers-empty">
                    <Users size={32} /><strong>No customers found</strong>
                    <span>Try changing your search or filters.</span>
                    <button type="button" onClick={resetFilters}>Clear filters</button>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="customers-pagination">
          <span>
            Showing {filteredCustomers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filteredCustomers.length)} of {filteredCustomers.length} customers
          </span>
          <div className="customers-pagination-controls">
            <button type="button" aria-label="Previous page" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
              <ChevronLeft size={17} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button type="button" key={page} className={currentPage === page ? "current" : ""} aria-label={`Page ${page}`} aria-current={currentPage === page ? "page" : undefined} onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            ))}
            <button type="button" aria-label="Next page" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="customers-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
          <section className="customers-modal" role="dialog" aria-modal="true" aria-labelledby="customer-modal-title">
            <div className="customers-modal-heading">
              <div>
                <span className="customers-eyebrow">CUSTOMER MANAGEMENT</span>
                <h2 id="customer-modal-title">{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>
                <p>{editingCustomer ? "Update the customer account details." : "Enter the details for the new customer."}</p>
              </div>
              <button type="button" className="customers-modal-close" aria-label="Close modal" onClick={closeModal}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Customer Name
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="Enter full name" required />
              </label>
              <label>Email Address
                <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="name@example.com" required />
              </label>
              <label>Company
                <input name="company" value={form.company} onChange={handleFormChange} placeholder="Enter company name" required />
              </label>

              <div className="customers-form-grid">
                <label>Subscription Plan
                  <select name="plan" value={form.plan} onChange={handleFormChange}>
                    <option value="Starter">Starter</option><option value="Growth">Growth</option>
                    <option value="Professional">Professional</option><option value="Enterprise">Enterprise</option>
                  </select>
                </label>
                <label>Account Status
                  <select name="status" value={form.status} onChange={handleFormChange}>
                    <option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Pending">Pending</option>
                  </select>
                </label>
              </div>

              <div className="customers-modal-actions">
                <button type="button" className="customers-btn customers-btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="customers-btn customers-btn-primary">{editingCustomer ? "Save Changes" : "Add Customer"}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {viewCustomer && (
        <div className="customers-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewCustomer(null); }}>
          <section className="customers-modal customers-view-modal" role="dialog" aria-modal="true" aria-labelledby="customer-view-title">
            <div className="customers-modal-heading">
              <div>
                <span className="customers-eyebrow">CUSTOMER DETAILS</span>
                <h2 id="customer-view-title">{viewCustomer.name}</h2>
                <p>Customer account information</p>
              </div>
              <button type="button" className="customers-modal-close" aria-label="Close details" onClick={() => setViewCustomer(null)}><X size={20} /></button>
            </div>

            <div className="customer-detail-list">
              <div><span>Email</span><strong>{viewCustomer.email}</strong></div>
              <div><span>Company</span><strong>{viewCustomer.company}</strong></div>
              <div><span>Subscription plan</span><strong>{viewCustomer.plan}</strong></div>
              <div><span>Account status</span><strong>{viewCustomer.status}</strong></div>
              <div><span>Joined date</span><strong>{formatDate(viewCustomer.joined)}</strong></div>
            </div>

            <div className="customers-modal-actions">
              <button type="button" className="customers-btn customers-btn-secondary" onClick={() => setViewCustomer(null)}>Close</button>
              <button type="button" className="customers-btn customers-btn-primary" onClick={() => { const customer = viewCustomer; setViewCustomer(null); openEditModal(customer); }}>
                <Pencil size={16} /> Edit Customer
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Customers;
