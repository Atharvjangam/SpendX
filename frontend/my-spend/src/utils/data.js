import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuBuilding2,
  LuHeart,
  LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "04",
    label: "Bank",
    icon: LuBuilding2,
    path: "/bank",
  },
  {
    id: "05",
    label: "Finance Score",
    icon: LuHeart,
    path: "/financial-health",
  },
  {
    id: "06",
    label: "Logout",
    icon: LuLogOut,
    path: "/logout",
  },
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Gift",
  "Other",
];

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Education",
  "Travel",
  "Other",
];


