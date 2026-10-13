
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  users: "saasflow-users",
  subscriptions: "saasflow-subscriptions",
  plans: "saasflow-plans",
  customers: "saasflow-customers",
  activities: "saasflow-activities",
};

const DEFAULT_USERS = [
  { id: "USR-1001", name: "Aarav Sharma", email: "aarav.sharma@example.com", role: "Admin", status: "Active", company: "Acme Inc.", joinedAt: "2026-01-12" },
  { id: "USR-1002", name: "Priya Reddy", email: "priya.reddy@example.com", role: "Manager", status: "Active", company: "Bright Labs", joinedAt: "2026-02-08" },
  { id: "USR-1003", name: "Rahul Mehta", email: "rahul.mehta@example.com", role: "User", status: "Pending", company: "Nova Tech", joinedAt: "2026-02-19" },
  { id: "USR-1004", name: "Ananya Iyer", email: "ananya.iyer@example.com", role: "User", status: "Active", company: "Acme Inc.", joinedAt: "2026-03-01" },
  { id: "USR-1005", name: "Vikram Rao", email: "vikram.rao@example.com", role: "Manager", status: "Inactive", company: "CloudNine", joinedAt: "2026-03-11" },
  { id: "USR-1006", name: "Sneha Kapoor", email: "sneha.kapoor@example.com", role: "User", status: "Active", company: "Bright Labs", joinedAt: "2026-04-05" },
  { id: "USR-1007", name: "Arjun Nair", email: "arjun.nair@example.com", role: "Admin", status: "Active", company: "Nova Tech", joinedAt: "2026-04-17" },
  { id: "USR-1008", name: "Meera Joshi", email: "meera.joshi@example.com", role: "User", status: "Pending", company: "CloudNine", joinedAt: "2026-05-02" },
];

const DEFAULT_CUSTOMERS = [
  { id: "CUS-1001", name: "Olivia Martin", email: "olivia.martin@example.com", company: "Acme Inc.", phone: "+1 555-0101", status: "Active", plan: "Enterprise", joinedAt: "2026-01-15" },
  { id: "CUS-1002", name: "James Wilson", email: "james.wilson@example.com", company: "Bright Labs", phone: "+1 555-0102", status: "Active", plan: "Professional", joinedAt: "2026-02-08" },
  { id: "CUS-1003", name: "Sophia Brown", email: "sophia.brown@example.com", company: "Nova Tech", phone: "+1 555-0103", status: "Inactive", plan: "Starter", joinedAt: "2026-02-19" },
  { id: "CUS-1004", name: "William Davis", email: "william.davis@example.com", company: "CloudNine", phone: "+1 555-0104", status: "Active", plan: "Enterprise", joinedAt: "2026-03-01" },
  { id: "CUS-1005", name: "Isabella Garcia", email: "isabella.garcia@example.com", company: "Vertex Solutions", phone: "+1 555-0105", status: "Pending", plan: "Professional", joinedAt: "2026-03-11" },
  { id: "CUS-1006", name: "Benjamin Miller", email: "benjamin.miller@example.com", company: "Acme Inc.", phone: "+1 555-0106", status: "Active", plan: "Starter", joinedAt: "2026-04-05" },
  { id: "CUS-1007", name: "Mia Anderson", email: "mia.anderson@example.com", company: "Bright Labs", phone: "+1 555-0107", status: "Active", plan: "Professional", joinedAt: "2026-04-17" },
  { id: "CUS-1008", name: "Ethan Thomas", email: "ethan.thomas@example.com", company: "Nova Tech", phone: "+1 555-0108", status: "Pending", plan: "Enterprise", joinedAt: "2026-05-02" },
];

const DEFAULT_SUBSCRIPTIONS = [
  {
    id: "SUB-1001",
    customer: "Olivia Martin",
    email: "olivia.martin@example.com",
    plan: "Enterprise",
    status: "Active",
    billing: "Monthly",
    amount: 199,
    startDate: "2026-01-15",
  },
  {
    id: "SUB-1002",
    customer: "James Wilson",
    email: "james.wilson@example.com",
    plan: "Professional",
    status: "Active",
    billing: "Monthly",
    amount: 79,
    startDate: "2026-02-08",
  },
  {
    id: "SUB-1003",
    customer: "Sophia Brown",
    email: "sophia.brown@example.com",
    plan: "Starter",
    status: "Trial",
    billing: "Monthly",
    amount: 19,
    startDate: "2026-02-19",
  },
  {
    id: "SUB-1004",
    customer: "William Davis",
    email: "william.davis@example.com",
    plan: "Enterprise",
    status: "Past due",
    billing: "Yearly",
    amount: 199,
    startDate: "2026-03-01",
  },
  {
    id: "SUB-1005",
    customer: "Isabella Garcia",
    email: "isabella.garcia@example.com",
    plan: "Professional",
    status: "Inactive",
    billing: "Quarterly",
    amount: 79,
    startDate: "2026-03-11",
  },
  {
    id: "SUB-1006",
    customer: "Benjamin Miller",
    email: "benjamin.miller@example.com",
    plan: "Starter",
    status: "Pending",
    billing: "Monthly",
    amount: 19,
    startDate: "2026-04-05",
  },
];

function readStorage(key, fallback = []) {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) return fallback;

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from localStorage:`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save ${key} to localStorage:`, error);
  }
}

function createActions(setItems, prefix) {
  const add = (item) => {
    const newItem = {
      ...item,
      id:
        item.id ||
        `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };

    setItems((current) => [...current, newItem]);

    return newItem;
  };

  const update = (id, updates) => {
    setItems((current) =>
      current.map((item) =>
        String(item.id ?? item.userId) === String(id)
          ? { ...item, ...updates }
          : item
      )
    );
  };

  const remove = (id) => {
    setItems((current) =>
      current.filter(
        (item) => String(item.id ?? item.userId) !== String(id)
      )
    );
  };

  return { add, update, remove };
}

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() =>
    readStorage(STORAGE_KEYS.users, DEFAULT_USERS)
  );

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = readStorage(
      STORAGE_KEYS.subscriptions,
      DEFAULT_SUBSCRIPTIONS
    );

    return saved.length > 0 ? saved : DEFAULT_SUBSCRIPTIONS;
  });

  const [plans, setPlans] = useState(() =>
    readStorage(STORAGE_KEYS.plans, [])
  );

  const [customers, setCustomers] = useState(() => {
    const saved = readStorage(
      STORAGE_KEYS.customers,
      DEFAULT_CUSTOMERS
    );

    return saved.length > 0 ? saved : DEFAULT_CUSTOMERS;
  });

  const [activities, setActivities] = useState(() =>
    readStorage(STORAGE_KEYS.activities, [])
  );

  useEffect(() => writeStorage(STORAGE_KEYS.users, users), [users]);

  useEffect(
    () => writeStorage(STORAGE_KEYS.subscriptions, subscriptions),
    [subscriptions]
  );

  useEffect(() => writeStorage(STORAGE_KEYS.plans, plans), [plans]);

  useEffect(
    () => writeStorage(STORAGE_KEYS.customers, customers),
    [customers]
  );

  useEffect(
    () => writeStorage(STORAGE_KEYS.activities, activities),
    [activities]
  );

  const recordActivity = useCallback((activity) => {
    setActivities((current) =>
      [
        {
          id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
          time: "Just now",
          ...activity,
        },
        ...current,
      ].slice(0, 50)
    );
  }, []);

  const userActions = useMemo(
    () => createActions(setUsers, "USR"),
    []
  );

  const subscriptionActions = useMemo(
    () => createActions(setSubscriptions, "SUB"),
    []
  );

  const planActions = useMemo(
    () => createActions(setPlans, "PLN"),
    []
  );

  const customerActions = useMemo(
    () => createActions(setCustomers, "CUS"),
    []
  );

  const addUser = useCallback(
    (item) => {
      const user = userActions.add(item);

      recordActivity({
        type: "user",
        title: "New user registered",
        description: `${user.name || user.email || "A new user"} was added`,
        path: "/users",
      });

      return user;
    },
    [userActions, recordActivity]
  );

  const updateUser = useCallback(
    (id, updates) => {
      userActions.update(id, updates);

      recordActivity({
        type: "user",
        title: "User updated",
        description: `User ${id} was updated`,
        path: "/users",
      });
    },
    [userActions, recordActivity]
  );

  const deleteUser = useCallback(
    (id) => {
      userActions.remove(id);

      recordActivity({
        type: "user",
        title: "User deleted",
        description: `User ${id} was removed`,
        path: "/users",
      });
    },
    [userActions, recordActivity]
  );

  const addSubscription = useCallback(
    (item) => {
      const subscription = subscriptionActions.add(item);
      const customerName =
        subscription.customer ||
        subscription.name ||
        subscription.email ||
        "A subscription";

      recordActivity({
        type: "subscription",
        title: "New subscription created",
        description: `Subscription created for ${customerName}`,
        path: "/subscriptions",
      });

      return subscription;
    },
    [subscriptionActions, recordActivity]
  );

  const updateSubscription = useCallback(
    (id, updates) => {
      setSubscriptions((current) =>
        current.map((subscription) =>
          String(subscription.id) === String(id)
            ? { ...subscription, ...updates, id: subscription.id }
            : subscription
        )
      );

      const currentSubscription = subscriptions.find(
        (subscription) => String(subscription.id) === String(id)
      );

      recordActivity({
        type: "subscription",
        title: "Subscription updated",
        description: `Subscription updated${
          currentSubscription?.customer
            ? ` for ${currentSubscription.customer}`
            : ""
        }`,
        path: "/subscriptions",
      });
    },
    [subscriptions, recordActivity]
  );

  const removeSubscription = useCallback(
    (id) => {
      const currentSubscription = subscriptions.find(
        (subscription) => String(subscription.id) === String(id)
      );

      setSubscriptions((current) =>
        current.filter(
          (subscription) => String(subscription.id) !== String(id)
        )
      );

      recordActivity({
        type: "subscription",
        title: "Subscription cancelled",
        description: `Subscription removed${
          currentSubscription?.customer
            ? ` for ${currentSubscription.customer}`
            : ""
        }`,
        path: "/subscriptions",
      });
    },
    [subscriptions, recordActivity]
  );

  const addPlan = useCallback(
    (item) => {
      const plan = planActions.add(item);

      recordActivity({
        type: "plan",
        title: "New plan created",
        description: `${plan.name || "A pricing plan"} was created`,
        path: "/plans",
      });

      return plan;
    },
    [planActions, recordActivity]
  );

  const updatePlan = useCallback(
    (id, updates) => {
      planActions.update(id, updates);

      recordActivity({
        type: "plan",
        title: "Plan updated",
        description: `Plan ${id} was updated`,
        path: "/plans",
      });
    },
    [planActions, recordActivity]
  );

  const deletePlan = useCallback(
    (id) => {
      planActions.remove(id);

      recordActivity({
        type: "plan",
        title: "Plan deleted",
        description: `Plan ${id} was removed`,
        path: "/plans",
      });
    },
    [planActions, recordActivity]
  );

  const addCustomer = useCallback(
    (item) => {
      const customer = customerActions.add(item);

      recordActivity({
        type: "success",
        title: "Customer account created",
        description: `${customer.name || customer.email || "A new customer"} was added`,
        path: "/customers",
      });

      return customer;
    },
    [customerActions, recordActivity]
  );

  const updateCustomer = useCallback(
    (id, updates) => {
      customerActions.update(id, updates);

      recordActivity({
        type: "success",
        title: "Customer updated",
        description: `Customer ${id} was updated`,
        path: "/customers",
      });
    },
    [customerActions, recordActivity]
  );

  const deleteCustomer = useCallback(
    (id) => {
      customerActions.remove(id);

      recordActivity({
        type: "error",
        title: "Customer deleted",
        description: `Customer ${id} was removed`,
        path: "/customers",
      });
    },
    [customerActions, recordActivity]
  );

  const value = useMemo(
    () => ({
      users,
      setUsers,
      addUser,
      updateUser,
      deleteUser,

      subscriptions,
      setSubscriptions,
      addSubscription,
      updateSubscription,
      removeSubscription,

      plans,
      setPlans,
      addPlan,
      updatePlan,
      deletePlan,

      customers,
      setCustomers,
      addCustomer,
      updateCustomer,
      deleteCustomer,

      activities,
      setActivities,
      recordActivity,
    }),
    [
      users,
      addUser,
      updateUser,
      deleteUser,
      subscriptions,
      addSubscription,
      updateSubscription,
      removeSubscription,
      plans,
      addPlan,
      updatePlan,
      deletePlan,
      customers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      activities,
      recordActivity,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside an AppProvider");
  }

  return context;
}

export default AppContext;
