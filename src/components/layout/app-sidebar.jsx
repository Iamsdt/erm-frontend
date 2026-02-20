import {
  Building2,
  CalendarDays,
  ChevronRight,
  Clock,
  ClipboardList,
  Home,
  LayoutDashboard,
  Layers,
  MailPlus,
  Plus,
  Settings,
  UserCircle2,
  Users,
} from "lucide-react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"

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
  { title: "Calendar View", url: "/leave/calendar", icon: CalendarDays },
]

const adminLeaveItems = [
  { title: "Admin Dashboard", url: "/leave/admin", icon: LayoutDashboard },
  { title: "Approvals", url: "/leave/admin/approvals", icon: ClipboardList },
  { title: "Settings", url: "/leave/admin/settings", icon: Settings },
]

const employeeLeaveItems = [
  { title: "My Dashboard", url: "/leave/employee", icon: UserCircle2 },
]

const employeeManagementItems = [
  { title: "All Employees", url: "/employee-management", icon: Users },
  {
    title: "Departments",
    url: "/employee-management/departments",
    icon: Building2,
  },
  { title: "New Employee", url: "/employee-management/create", icon: Plus },
  { title: "Invite User", url: "/employee-management/invite", icon: MailPlus },
]

const employeeAttendanceItems = [
  { title: "Clock In/Out", url: "/attendance", icon: Clock },
  { title: "My History", url: "/attendance/history", icon: ClipboardList },
]

const adminAttendanceItems = [
  { title: "Activity Logs", url: "/attendance/admin/logs", icon: ClipboardList },
  { title: "Live Status", url: "/attendance/admin/live", icon: Clock },
  { title: "Summary", url: "/attendance/admin/summary", icon: LayoutDashboard },
]

// ─── Simple nav group (Application) ──────────────────────────────────────────

const NavGroup = ({ label, items }) => (
  <SidebarGroup>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
)

NavGroup.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
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
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
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
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
    })
  ).isRequired,
}

// ─── Modules section ──────────────────────────────────────────────────────────

const ModulesNavGroup = ({ isLeaveAdmin, isLeaveEmployee, isEmpAdmin }) => {
  const roleItems = isLeaveAdmin
    ? adminLeaveItems
    : isLeaveEmployee
      ? employeeLeaveItems
      : []

  const leaveItems = [...leaveSharedItems, ...roleItems]
  const showLeave = isLeaveAdmin || isLeaveEmployee
  const showEmpMgmt = isEmpAdmin
  
  // Attendance is visible to all authenticated users for employee items
  // Admin items visible only to admins (using isLeaveAdmin as admin check)
  const attendanceItems = isLeaveAdmin
    ? [...employeeAttendanceItems, ...adminAttendanceItems]
    : employeeAttendanceItems

  if (!showLeave && !showEmpMgmt) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Modules</SidebarGroupLabel>
      <SidebarGroupContent>
        {showLeave && (
          <CollapsibleNavGroup
            title="Leave Management"
            icon={Layers}
            items={leaveItems}
          />
        )}
        <CollapsibleNavGroup
          title="Attendance"
          icon={Clock}
          items={attendanceItems}
        />
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

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <NavGroup label="Application" items={mainItems} />
        <ModulesNavGroup
          isLeaveAdmin={leaveRole === "admin"}
          isLeaveEmployee={leaveRole === "employee"}
          isEmpAdmin={empMgmtRole === "admin"}
        />
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
