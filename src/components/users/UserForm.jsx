
import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const roleOptions = [
  { label: "Admin", value: "Admin" },
  { label: "Manager", value: "Manager" },
  { label: "User", value: "User" },
];

const planOptions = [
  { label: "Free", value: "Free" },
  { label: "Basic", value: "Basic" },
  { label: "Premium", value: "Premium" },
  { label: "Enterprise", value: "Enterprise" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

const initialForm = {
  name: "",
  email: "",
  role: "User",
  plan: "Free",
  status: "active",
};

function UserForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role || "User",
        plan: initialData.plan || initialData.planName || "Free",
        status: initialData.status || "active",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "Name must contain at least 2 characters.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit?.({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
    });
  };

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <div className="user-form__heading">
        <div>
          <h3>{initialData ? "Edit User" : "Create New User"}</h3>
          <p>
            {initialData
              ? "Update the user's account information."
              : "Enter the details to add a user to your platform."}
          </p>
        </div>
      </div>

      <div className="user-form__fields">
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter full name"
          value={form.name}
          onChange={(value) => handleChange("name", value)}
          error={errors.name}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={form.email}
          onChange={(value) => handleChange("email", value)}
          error={errors.email}
          required
        />

        <Select
          label="Role"
          name="role"
          options={roleOptions}
          value={form.role}
          onChange={(value) => handleChange("role", value)}
          required
        />

        <Select
          label="Subscription Plan"
          name="plan"
          options={planOptions}
          value={form.plan}
          onChange={(value) => handleChange("plan", value)}
          required
        />

        <Select
          label="Account Status"
          name="status"
          options={statusOptions}
          value={form.status}
          onChange={(value) => handleChange("status", value)}
          required
        />
      </div>

      <div className="user-form__actions">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            icon={<X size={16} />}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          icon={<Save size={16} />}
          loading={loading}
          disabled={loading}
        >
          {initialData ? "Save Changes" : "Create User"}
        </Button>
      </div>
    </form>
  );
}

export default UserForm;