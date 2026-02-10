import {
  CalendarDays,
  ClipboardList,
  FileEdit,
  Home,
  LayoutDashboard,
  UserCircle2,
} from "lucide-react"
import { useSelector } from "react-redux"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import ct from "@constants/"

const mainItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
]

const leaveSharedItems = [
  { title: "Calendar View", url: "/leave/calendar", icon: CalendarDays },
]

const adminLeaveItems = [
  { title: "Admin Dashboard", url: "/leave/admin", icon: LayoutDashboard },
  { title: "Approvals", url: "/leave/admin/approvals", icon: ClipboardList },
]

const employeeLeaveItems = [
  { title: "My Dashboard", url: "/leave/employee", icon: UserCircle2 },
]

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

/**
 * AppSidebar renders a collapsible sidebar with navigation filtered by leave_management_role.
 */
const AppSidebar = () => {
  const leaveRole = useSelector(
    (s) => s[ct.store.USER_STORE].leave_management_role
  )

  const isAdmin = leaveRole === "admin"
  const isEmployee = leaveRole === "employee"

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <NavGroup label="Application" items={mainItems} />
        <NavGroup label="Leave Management" items={leaveSharedItems} />
        {isAdmin && <NavGroup label="Admin" items={adminLeaveItems} />}
        {isEmployee && <NavGroup label="Employee" items={employeeLeaveItems} />}
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
