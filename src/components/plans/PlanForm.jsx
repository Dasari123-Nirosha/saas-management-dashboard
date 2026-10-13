
import { useEffect, useState } from "react";
import { Plus, Save, X, Trash2 } from "lucide-react";

import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const initialForm = {
  name: "",
  description: "",
  price: "",
  currency: "USD",
  billingCycle: "month",
  userLimit: "",
  status: "active",
  features: [""],
};

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const billingOptions = [
  { label: "Monthly", value: "month" },
  { label: "Yearly", value: "year" },
];

function PlanForm({
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
        name: initialData.name || initialData.planName || "",
        description: initialData.description || "",
        price: String(initialData.price ?? initialData.amount ?? ""),
        currency: initialData.currency || "USD",
        billingCycle:
          initialData.billingCycle || initialData.interval || "month",
        userLimit:
          initialData.userLimit === undefined ||
          initialData.userLimit === null
            ? ""
            : String(initialData.userLimit),
        status: initialData.status || "active",
        features:
          Array.isArray(initialData.features) &&
          initialData.features.length > 0
            ? initialData.features
            : [""],
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

  const handleFeatureChange = (index, value) => {
    setForm((previous) => ({
      ...previous,
      features: previous.features.map((feature, featureIndex) =>
        featureIndex === index ? value : feature
      ),
    }));
  };

  const addFeature = () => {
    setForm((previous) => ({
      ...previous,
      features: [...previous.features, ""],
    }));
  };

  const removeFeature = (index) => {
    setForm((previous) => ({
      ...previous,
      features:
        previous.features.length === 1
          ? [""]
          : previous.features.filter(
              (_, featureIndex) => featureIndex !== index
            ),
    }));
  };

  const validate = () => {
    const nextErrors = {};
    const price = Number(form.price);
    const userLimit = Number(form.userLimit);

    if (!form.name.trim()) {
      nextErrors.name = "Plan name is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (
      form.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      nextErrors.price = "Enter a valid price of 0 or more.";
    }

    if (
      form.userLimit !== "" &&
      (!Number.isInteger(userLimit) || userLimit < 1)
    ) {
      nextErrors.userLimit =
        "Enter a positive whole number or leave it empty for unlimited users.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const features = form.features
      .map((feature) => feature.trim())
      .filter(Boolean);

    onSubmit?.({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      amount: Number(form.price),
      userLimit:
        form.userLimit === "" ? null : Number(form.userLimit),
      features,
    });
  };

  return (
    <form className="plan-form" onSubmit={handleSubmit} noValidate>
      <div className="plan-form__heading">
        <h3>{initialData ? "Edit Plan" : "Create New Plan"}</h3>
        <p>Configure pricing, limits, and included features.</p>
      </div>

      <div className="plan-form__fields">
        <Input
          label="Plan Name"
          name="name"
          placeholder="e.g. Premium"
          value={form.name}
          onChange={(value) => handleChange("name", value)}
          error={errors.name}
          required
        />

        <Input
          label="Description"
          name="description"
          placeholder="Describe what this plan offers"
          value={form.description}
          onChange={(value) => handleChange("description", value)}
          error={errors.description}
          required
        />

        <Input
          label="Price"
          name="price"
          type="number"
          placeholder="Enter price"
          value={form.price}
          onChange={(value) => handleChange("price", value)}
          error={errors.price}
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

        <Select
          label="Billing Cycle"
          name="billingCycle"
          options={billingOptions}
          value={form.billingCycle}
          onChange={(value) => handleChange("billingCycle", value)}
          required
        />

        <Input
          label="User Limit"
          name="userLimit"
          type="number"
          placeholder="Leave empty for unlimited"
          value={form.userLimit}
          onChange={(value) => handleChange("userLimit", value)}
          error={errors.userLimit}
          hint="Leave empty to allow unlimited users."
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

      <div className="plan-form__features">
        <div className="plan-form__features-heading">
          <div>
            <h4>Plan Features</h4>
            <p>Add the features included with this plan.</p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="small"
            icon={<Plus size={15} />}
            onClick={addFeature}
            disabled={loading}
          >
            Add Feature
          </Button>
        </div>

        <div className="plan-form__feature-list">
          {form.features.map((feature, index) => (
            <div className="plan-form__feature-row" key={index}>
              <Input
                name={`feature-${index}`}
                placeholder={`Feature ${index + 1}`}
                value={feature}
                onChange={(value) =>
                  handleFeatureChange(index, value)
                }
              />

              <button
                type="button"
                className="plan-form__remove-feature"
                onClick={() => removeFeature(index)}
                aria-label={`Remove feature ${index + 1}`}
                disabled={loading}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="plan-form__actions">
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
          {initialData ? "Save Changes" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}

export default PlanForm;