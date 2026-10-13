
export function isRequired(value) {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim().length > 0
  );
}

export function isValidEmail(email) {
  if (!isRequired(email)) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email).trim()
  );
}

export function isValidPhone(phone) {
  if (!isRequired(phone)) return false;

  const cleanedPhone = String(phone).replace(/[\s()+-]/g, "");

  return /^\d{7,15}$/.test(cleanedPhone);
}

export function isValidNumber(value, min = 0, max = Infinity) {
  if (value === "" || value === null || value === undefined) {
    return false;
  }

  const number = Number(value);

  return (
    Number.isFinite(number) &&
    number >= min &&
    number <= max
  );
}

export function isValidPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

export function validateUser(user) {
  const errors = {};

  if (!isRequired(user.name)) {
    errors.name = "Name is required.";
  }

  if (!isValidEmail(user.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isRequired(user.role)) {
    errors.role = "Please select a role.";
  }

  if (!isRequired(user.status)) {
    errors.status = "Please select a status.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCustomer(customer) {
  const errors = {};

  if (!isRequired(customer.name)) {
    errors.name = "Customer name is required.";
  }

  if (!isValidEmail(customer.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (
    customer.phone &&
    !isValidPhone(customer.phone)
  ) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!isRequired(customer.company)) {
    errors.company = "Company name is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePlan(plan) {
  const errors = {};

  if (!isRequired(plan.name)) {
    errors.name = "Plan name is required.";
  }

  if (!isValidNumber(plan.price, 0)) {
    errors.price = "Enter a valid non-negative price.";
  }

  if (!isRequired(plan.billingCycle)) {
    errors.billingCycle = "Please select a billing cycle.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateSubscription(subscription) {
  const errors = {};

  if (!isRequired(subscription.customerName)) {
    errors.customerName = "Customer name is required.";
  }

  if (!isRequired(subscription.plan)) {
    errors.plan = "Please select a plan.";
  }

  if (!isValidNumber(subscription.amount, 0)) {
    errors.amount = "Enter a valid non-negative amount.";
  }

  if (!isRequired(subscription.status)) {
    errors.status = "Please select a subscription status.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}