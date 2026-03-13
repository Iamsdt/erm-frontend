import {
  Award,
  Bell,
  Bot,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock,
  ClipboardList,
  FileText,
  FolderOpen,
  Home,
  LayoutDashboard,
  Layers,
  MailPlus,
  MessageSquare,
  Plus,
  ScrollText,
  Settings,
  Sparkles,
  TrendingUp,
  UserCircle2,
  Users,
} from "lucide-react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import ct from "@constants/"

// ─── Nav data ────────────────────────────────────────────────────────────────

const mainItems = [{ title: "Home", url: "/", icon: Home }]

const leaveSharedItems = [
  { title: "Calendar View", url: ct.route.leave.CALENDAR, icon: CalendarDays },
]

const adminLeaveItems = [
  {
    title: "Admin Dashboard",
    url: ct.route.leave.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Approvals",
    url: ct.route.leave.ADMIN_APPROVALS,
    icon: ClipboardList,
  },
  { title: "Settings", url: ct.route.leave.ADMIN_SETTINGS, icon: Settings },
]

const employeeLeaveItems = [
  {
    title: "My Dashboard",
    url: ct.route.leave.EMPLOYEE_DASHBOARD,
    icon: UserCircle2,
  },
]

const employeeManagementItems = [
  {
    title: "All Employees",
    url: ct.route.employeeManagement.LIST,
    icon: Users,
  },
  {
    title: "Departments",
    url: ct.route.employeeManagement.DEPARTMENTS,
    icon: Building2,
  },
  {
    title: "New Employee",
    url: ct.route.employeeManagement.CREATE,
    icon: Plus,
  },
  {
    title: "Invite User",
    url: ct.route.employeeManagement.INVITE,
    icon: MailPlus,
  },
]

const employeeAttendanceItems = [
  {
    title: "Clock In/Out",
    url: ct.route.attendance.EMPLOYEE_CLOCK,
    icon: Clock,
  },
  {
    title: "My History",
    url: ct.route.attendance.EMPLOYEE_HISTORY,
    icon: ClipboardList,
  },
]

const adminAttendanceItems = [
  {
    title: "Activity Logs",
    url: ct.route.attendance.ADMIN_LOGS,
    icon: ClipboardList,
  },
  {
    title: "Live Status",
    url: ct.route.attendance.ADMIN_LIVE,
    icon: Clock,
  },
  {
    title: "Summary",
    url: ct.route.attendance.ADMIN_SUMMARY,
    icon: LayoutDashboard,
  },
]

const projectManagementItems = [
  { title: "All Projects", url: ct.route.project.LIST, icon: FolderOpen },
]

const dailyUpdateItems = [
  {
    title: "Daily Standup",
    url: ct.route.dailyUpdate.STANDUP,
    icon: MessageSquare,
  },
  { title: "Team Updates", url: ct.route.dailyUpdate.TEAM, icon: Users },
  {
    title: "Progress Log",
    url: ct.route.dailyUpdate.PROGRESS,
    icon: TrendingUp,
  },
]

const aiItems = [
  { title: "Insights", url: ct.route.ai.INSIGHTS, icon: Sparkles },
  { title: "Recommendations", url: ct.route.ai.RECOMMENDATIONS, icon: Bot },
  { title: "Analytics", url: ct.route.ai.ANALYTICS, icon: TrendingUp },
]

const quickAccessItems = [
  { title: "Notifications", url: ct.route.notifications.INDEX, icon: Bell },
  { title: "Activity Log", url: ct.route.audit.LOG, icon: ScrollText },
  { title: "Policies", url: ct.route.policy.INDEX, icon: FileText },
  { title: "Rewards", url: ct.route.rewards.INDEX, icon: Award },
]

// ─── Simple nav group (Application) ──────────────────────────────────────────

const navItemShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
})

const NavGroup = ({ label, items }) => (
  <SidebarGroup>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
)

NavGroup.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(navItemShape).isRequired,
}

// ─── Reusable collapsible module group ───────────────────────────────────────

const CollapsibleNavGroup = ({ title, icon: Icon, items }) => (
  <SidebarMenu>
    <Collapsible asChild defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={title}>
            <Icon />
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.title}>
                <SidebarMenuSubButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  </SidebarMenu>
)

CollapsibleNavGroup.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  items: PropTypes.arrayOf(navItemShape).isRequired,
}

// ─── Modules section ──────────────────────────────────────────────────────────

const buildLeaveItems = (isAdmin, isEmployee) => {
  const roleItems = isAdmin
    ? adminLeaveItems
    : isEmployee
      ? employeeLeaveItems
      : []
  return [...leaveSharedItems, ...roleItems]
}

const buildAttendanceItems = (isAdmin) =>
  isAdmin
    ? [...employeeAttendanceItems, ...adminAttendanceItems]
    : employeeAttendanceItems

const ModulesNavGroup = ({
  isLeaveAdmin,
  isLeaveEmployee,
  isEmpAdmin,
  isAttendanceAdmin,
  isAttendanceEmployee,
}) => {
  const showLeave = isLeaveAdmin || isLeaveEmployee
  const showEmpMgmt = isEmpAdmin
  const showAttendance = isAttendanceAdmin || isAttendanceEmployee

  if (!showLeave && !showEmpMgmt && !showAttendance) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Modules</SidebarGroupLabel>
      <SidebarGroupContent>
        {showLeave && (
          <CollapsibleNavGroup
            title="Leave Management"
            icon={Layers}
            items={buildLeaveItems(isLeaveAdmin, isLeaveEmployee)}
          />
        )}
        {showAttendance && (
          <CollapsibleNavGroup
            title="Attendance"
            icon={Clock}
            items={buildAttendanceItems(isAttendanceAdmin)}
          />
        )}
        {showEmpMgmt && (
          <CollapsibleNavGroup
            title="Employee Management"
            icon={Users}
            items={employeeManagementItems}
          />
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

ModulesNavGroup.propTypes = {
  isLeaveAdmin: PropTypes.bool.isRequired,
  isLeaveEmployee: PropTypes.bool.isRequired,
  isEmpAdmin: PropTypes.bool.isRequired,
  isAttendanceAdmin: PropTypes.bool.isRequired,
  isAttendanceEmployee: PropTypes.bool.isRequired,
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────

/**
 * AppSidebar renders a collapsible sidebar.
 * Each module collapses independently and shows role-specific items.
 */
const AppSidebar = () => {
  const leaveRole = useSelector(
    (s) => s[ct.store.USER_STORE].leave_management_role
  )
  const empMgmtRole = useSelector(
    (s) => s[ct.store.USER_STORE].employee_management_role
  )
  const attendanceRole = useSelector(
    (s) => s[ct.store.USER_STORE].attendance_management_role
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <NavGroup label="Application" items={mainItems} />
        <ModulesNavGroup
          isLeaveAdmin={leaveRole === "admin"}
          isLeaveEmployee={leaveRole === "employee"}
          isEmpAdmin={empMgmtRole === "admin"}
          isAttendanceAdmin={attendanceRole === "admin"}
          isAttendanceEmployee={attendanceRole === "employee"}
        />
        <NavGroup label="Projects" items={projectManagementItems} />
        <CollapsibleNavGroup
          title="Daily Updates"
          icon={CalendarDays}
          items={dailyUpdateItems}
        />
        <CollapsibleNavGroup
          title="AI & Analytics"
          icon={Sparkles}
          items={aiItems}
        />
        <NavGroup label="Quick Access" items={quickAccessItems} />
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
