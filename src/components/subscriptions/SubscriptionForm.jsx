
import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const planOptions = [
  { label: "Free", value: "Free" },
  { label: "Basic", value: "Basic" },
  { label: "Premium", value: "Premium" },
  { label: "Enterprise", value: "Enterprise" },
];

const billingOptions = [
  { label: "Monthly", value: "month" },
  { label: "Yearly", value: "year" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Trial", value: "trial" },
  { label: "Pending", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
];

const initialForm = {
  name: "",
  customerName: "",
  customerEmail: "",
  price: "",
  currency: "USD",
  billingCycle: "month",
  startDate: new Date().toISOString().slice(0, 10),
  status: "active",
};

function SubscriptionForm({
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
        name:
          initialData.name ||
          initialData.planName ||
          initialData.plan ||
          "",
        customerName:
          initialData.customerName ||
          initialData.userName ||
          initialData.customer ||
          "",
        customerEmail: initialData.customerEmail || "",
        price: String(
          initialData.price ??
            initialData.amount ??
            initialData.monthlyPrice ??
            ""
        ),
        currency: initialData.currency || "USD",
        billingCycle:
          initialData.billingCycle ||
          initialData.interval ||
          "month",
        startDate: initialData.startDate
          ? String(initialData.startDate).slice(0, 10)
          : initialData.createdAt
            ? String(initialData.createdAt).slice(0, 10)
            : initialForm.startDate,
        status: initialData.status || "active",
      });
    } else {
      setForm({
        ...initialForm,
        startDate: new Date().toISOString().slice(0, 10),
      });
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
    const price = Number(form.price);

    if (!form.name.trim()) {
      nextErrors.name = "Please select a subscription plan.";
    }

    if (!form.customerName.trim()) {
      nextErrors.customerName = "Customer name is required.";
    }

    if (
      form.customerEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.customerEmail.trim()
      )
    ) {
      nextErrors.customerEmail = "Enter a valid email address.";
    }

    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      nextErrors.price = "Enter a valid price of 0 or more.";
    }

    if (!form.startDate) {
      nextErrors.startDate = "Start date is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit?.({
      ...form,
      price: Number(form.price),
      amount: Number(form.price),
      planName: form.name,
      startDate: form.startDate,
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim().toLowerCase(),
    });
  };

  return (
    <form
      className="subscription-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="subscription-form__heading">
        <h3>
          {initialData
            ? "Edit Subscription"
            : "Create Subscription"}
        </h3>

        <p>
          Enter the customer, plan, and billing details below.
        </p>
      </div>

      <div className="subscription-form__fields">
        <Select
          label="Subscription Plan"
          name="name"
          options={planOptions}
          value={form.name}
          onChange={(value) => handleChange("name", value)}
          error={errors.name}
          placeholder="Choose a plan"
          required
        />

        <Input
          label="Customer Name"
          name="customerName"
          placeholder="Enter customer name"
          value={form.customerName}
          onChange={(value) =>
            handleChange("customerName", value)
          }
          error={errors.customerName}
          required
        />

        <Input
          label="Customer Email"
          name="customerEmail"
          type="email"
          placeholder="customer@example.com"
          value={form.customerEmail}
          onChange={(value) =>
            handleChange("customerEmail", value)
          }
          error={errors.customerEmail}
        />

        <Input
          label="Price"
          name="price"
          type="number"
          placeholder="Enter subscription price"
          value={form.price}
          onChange={(value) => handleChange("price", value)}
          error={errors.price}
          required
        />

        <Select
          label="Billing Cycle"
          name="billingCycle"
          options={billingOptions}
          value={form.billingCycle}
          onChange={(value) =>
            handleChange("billingCycle", value)
          }
          required
        />

        <Select
          label="Currency"
          name="currency"
          options={[
            { label: "USD ($)", value: "USD" },
            { label: "INR (₹)", value: "INR" },
            { label: "EUR (€)", value: "EUR" },
            { label: "GBP (£)", value: "GBP" },
          ]}
          value={form.currency}
          onChange={(value) => handleChange("currency", value)}
          required
        />

        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={(value) =>
            handleChange("startDate", value)
          }
          error={errors.startDate}
          required
        />

        <Select
          label="Status"
          name="status"
          options={statusOptions}
          value={form.status}
          onChange={(value) => handleChange("status", value)}
          required
        />
      </div>

      <div className="subscription-form__actions">
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
          {initialData
            ? "Save Changes"
            : "Create Subscription"}
        </Button>
      </div>
    </form>
  );
}

export default SubscriptionForm;