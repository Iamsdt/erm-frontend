import {
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Home,
  LayoutDashboard,
  Layers,
  UserCircle2,
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
]

const employeeLeaveItems = [
  { title: "My Dashboard", url: "/leave/employee", icon: UserCircle2 },
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

// ─── Collapsible Leave Management group ──────────────────────────────────────

const LeaveNavGroup = ({ isAdmin, isEmployee }) => {
  const roleItems = isAdmin
    ? adminLeaveItems
    : isEmployee
      ? employeeLeaveItems
      : []

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Modules</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <Collapsible asChild defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              {/* Collapsible trigger — acts as the "Leave Management" parent row */}
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Leave Management">
                  <Layers />
                  <span>Leave Management</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {/* Shared — Calendar View */}
                  {leaveSharedItems.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}

                  {/* Role-specific items */}
                  {roleItems.map((item) => (
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
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

LeaveNavGroup.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isEmployee: PropTypes.bool.isRequired,
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────

/**
 * AppSidebar renders a collapsible sidebar.
 * The Leave Management section collapses and shows role-specific items.
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
        <LeaveNavGroup isAdmin={isAdmin} isEmployee={isEmployee} />
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
