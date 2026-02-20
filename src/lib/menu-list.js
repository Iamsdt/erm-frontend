import {
  Users,
  Settings,
  SquarePen,
  LayoutGrid,
  Clock,
  ClipboardList,
} from "lucide-react"

const POSTS_NEW_PATH = "/posts/new"
const ATTENDANCE_EMPLOYEE = "/attendance"
const ATTENDANCE_HISTORY = "/attendance/history"
const ATTENDANCE_ADMIN = "/attendance/admin"
const ATTENDANCE_ADMIN_LOGS = "/attendance/admin/logs"
const ATTENDANCE_ADMIN_LIVE = "/attendance/admin/live"
const ATTENDANCE_ADMIN_SUMMARY = "/attendance/admin/summary"

/**
 * Returns the dashboard menu group configuration.
 * @param {string} pathname - The current pathname.
 * @returns {object} The dashboard menu group object.
 */
const getDashboardMenuGroup = (pathname) => ({
  groupLabel: "",
  menus: [
    {
      href: "/",
      label: "Dashboard",
      active: pathname.includes("/dashboard"),
      icon: LayoutGrid,
      submenus: [],
    },
  ],
})

/**
 * Returns the contents menu group configuration.
 * @param {string} pathname - The current pathname.
 * @returns {object} The contents menu group object.
 */
const getContentsMenuGroup = (pathname) => ({
  groupLabel: "Contents",
  menus: [
    {
      href: "",
      label: "Posts",
      active: pathname.includes("/posts"),
      icon: SquarePen,
      submenus: [
        {
          href: "/posts",
          label: "All Posts",
          active: pathname === "/posts",
        },
        {
          href: POSTS_NEW_PATH,
          label: "New Post",
          active: pathname === POSTS_NEW_PATH,
        },
      ],
    },
  ],
})

/**
 * Returns the employee attendance menu group configuration.
 * @param {string} pathname - The current pathname.
 * @returns {object} The attendance menu group object.
 */
const getAttendanceMenuGroup = (pathname) => ({
  groupLabel: "Attendance",
  menus: [
    {
      href: "",
      label: "My Attendance",
      active:
        pathname.startsWith(ATTENDANCE_EMPLOYEE) &&
        !pathname.startsWith(ATTENDANCE_ADMIN),
      icon: Clock,
      submenus: [
        {
          href: ATTENDANCE_EMPLOYEE,
          label: "Clock In / Out",
          active: pathname === ATTENDANCE_EMPLOYEE,
        },
        {
          href: ATTENDANCE_HISTORY,
          label: "My History",
          active: pathname === ATTENDANCE_HISTORY,
        },
      ],
    },
  ],
})

/**
 * Returns the admin attendance menu group configuration.
 * @param {string} pathname - The current pathname.
 * @returns {object} The admin attendance menu group object.
 */
const getAttendanceAdminMenuGroup = (pathname) => ({
  groupLabel: "Attendance (Admin)",
  menus: [
    {
      href: "",
      label: "Attendance Admin",
      active: pathname.startsWith(ATTENDANCE_ADMIN),
      icon: ClipboardList,
      submenus: [
        {
          href: ATTENDANCE_ADMIN_LOGS,
          label: "Activity Logs",
          active: pathname === ATTENDANCE_ADMIN_LOGS,
        },
        {
          href: ATTENDANCE_ADMIN_LIVE,
          label: "Live Status",
          active: pathname === ATTENDANCE_ADMIN_LIVE,
        },
        {
          href: ATTENDANCE_ADMIN_SUMMARY,
          label: "Summary",
          active: pathname === ATTENDANCE_ADMIN_SUMMARY,
        },
      ],
    },
  ],
})

/**
 * Returns the settings menu group configuration.
 * @param {string} pathname - The current pathname.
 * @returns {object} The settings menu group object.
 */
const getSettingsMenuGroup = (pathname) => ({
  groupLabel: "Settings",
  menus: [
    {
      href: "/users",
      label: "Users",
      active: pathname.includes("/users"),
      icon: Users,
      submenus: [],
    },
    {
      href: "/account",
      label: "Account",
      active: pathname.includes("/account"),
      icon: Settings,
      submenus: [],
    },
  ],
})

/**
 * Returns the complete menu list configuration.
 * @param {string} pathname - The current pathname.
 * @returns {Array<object>} The array of menu group objects.
 */
export const getMenuList = (pathname) => [
  getDashboardMenuGroup(pathname),
  getContentsMenuGroup(pathname),
  getAttendanceMenuGroup(pathname),
  getAttendanceAdminMenuGroup(pathname),
  getSettingsMenuGroup(pathname),
]
