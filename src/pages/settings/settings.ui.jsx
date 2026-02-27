import { Bell, Globe, Monitor, Moon, Sun } from "lucide-react"
import PropTypes from "prop-types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

// ─── Theme option button ──────────────────────────────────────────────────────

const ThemeButton = ({ icon: Icon, label, value, active, onClick }) => (
  <Button
    variant={active ? "default" : "outline"}
    className="justify-start gap-2 h-10"
    onClick={() => onClick(value)}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Button>
)

ThemeButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

ThemeButton.defaultProps = {
  active: false,
}

// ─── Notification row ─────────────────────────────────────────────────────────

const NotificationRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 py-2.5">
    <div>
      <p className="text-sm font-medium">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
)

NotificationRow.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
}

NotificationRow.defaultProps = {
  description: undefined,
}

// ─── Main UI ──────────────────────────────────────────────────────────────────

const SettingsUI = ({
  theme,
  currentLanguage,
  notifications,
  onThemeChange,
  onLanguageChange,
  onNotificationToggle,
}) => {
  return (
    <div className="space-y-5">
      {/* Appearance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>
            Choose how this workspace looks for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <ThemeButton
              icon={Sun}
              label="Light"
              value="light"
              active={theme === "light"}
              onClick={onThemeChange}
            />
            <ThemeButton
              icon={Moon}
              label="Dark"
              value="dark"
              active={theme === "dark"}
              onClick={onThemeChange}
            />
            <ThemeButton
              icon={Monitor}
              label="System"
              value="system"
              active={theme === "system"}
              onClick={onThemeChange}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Changes are applied immediately and saved for your next login.
          </p>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Language
          </CardTitle>
          <CardDescription>
            Select your preferred language for labels and content.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { value: "en", label: "English" },
            { value: "hi", label: "हिन्दी" },
          ].map(({ value, label }) => (
            <Button
              key={value}
              variant={currentLanguage === value ? "default" : "outline"}
              onClick={() => onLanguageChange(value)}
              className="justify-between"
            >
              {label}
              {currentLanguage === value && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  Active
                </Badge>
              )}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
          <CardDescription>
            Control which notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5">
          <NotificationRow
            label="Email Alerts"
            description="Receive important notifications via email."
            checked={notifications.emailAlerts}
            onChange={() => onNotificationToggle("emailAlerts")}
          />
          <Separator />
          <NotificationRow
            label="Leave Updates"
            description="Notifications for leave approvals and rejections."
            checked={notifications.leaveUpdates}
            onChange={() => onNotificationToggle("leaveUpdates")}
          />
          <Separator />
          <NotificationRow
            label="Project Updates"
            description="Sprint and task activity in your projects."
            checked={notifications.projectUpdates}
            onChange={() => onNotificationToggle("projectUpdates")}
          />
          <Separator />
          <NotificationRow
            label="Attendance Reminders"
            description="Reminders to clock in and out."
            checked={notifications.attendanceReminders}
            onChange={() => onNotificationToggle("attendanceReminders")}
          />
          <Separator />
          <NotificationRow
            label="Weekly Digest"
            description="A summary of your week every Friday."
            checked={notifications.weeklyDigest}
            onChange={() => onNotificationToggle("weeklyDigest")}
          />
        </CardContent>
      </Card>
    </div>
  )
}

SettingsUI.propTypes = {
  theme: PropTypes.string.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  notifications: PropTypes.object.isRequired,
  onThemeChange: PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  onNotificationToggle: PropTypes.func.isRequired,
}

export default SettingsUI
