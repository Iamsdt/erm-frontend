import i18n from "i18next"
import { useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"

import { toast } from "@/components/ui/use-toast"
import { useTheme } from "@/lib/context/theme-provider"
import { useFetchEmployees } from "@query/employee-management.query"
import {
  useChangePassword,
  useFetchMyProfile,
  useUpdateMyProfile,
} from "@query/profile.query"
import { useFetchSettings, useUpdateSettings } from "@query/settings.query"
import {
  useCreateTeam,
  useDeleteTeam,
  useFetchTeams,
  useRemoveTeamMember,
  useUpdateTeamResponsibilities,
} from "@query/team.query"

import ProfileUI from "./profile.ui"

const EMPTY_TEAM_DRAFT = {
  name: "",
  leadId: "",
  memberIds: [],
}
const DESTRUCTIVE_VARIANT = "destructive"

const createTeamId = (name) => {
  const normalizedName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return `team-${normalizedName || "new-team"}`
}

/**
 * Custom hook encapsulating all team management logic —
 * fetching, creating, editing responsibilities, and local draft state.
 * @returns {object} Team state and handlers
 */
const useTeamManagement = () => {
  const { data: teamsData } = useFetchTeams()
  const teams = useMemo(() => teamsData?.teams ?? [], [teamsData])
  const createTeamMutation = useCreateTeam()
  const deleteTeamMutation = useDeleteTeam()
  const removeTeamMemberMutation = useRemoveTeamMember()
  const updateResponsibilitiesMutation = useUpdateTeamResponsibilities()

  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [teamDraft, setTeamDraft] = useState(EMPTY_TEAM_DRAFT)
  const [localResponsibilities, setLocalResponsibilities] = useState({})
  const previousTeamIdReference = useRef("")

  // Derive selectedTeamId from fetched data without useEffect
  const firstTeamId = teams.length > 0 ? teams[0].id : ""
  const resolvedTeamId = selectedTeamId || firstTeamId

  // Sync local responsibilities when the resolved team changes
  if (resolvedTeamId !== previousTeamIdReference.current) {
    previousTeamIdReference.current = resolvedTeamId
    const selectedTeam = teams.find((team) => team.id === resolvedTeamId)
    if (selectedTeam) {
      setLocalResponsibilities(selectedTeam.responsibilities)
    }
  }

  const teamsWithLocalEdits = useMemo(
    () =>
      teams.map((team) => {
        if (team.id !== resolvedTeamId) return team
        return {
          ...team,
          responsibilities: {
            ...team.responsibilities,
            ...localResponsibilities,
          },
        }
      }),
    [teams, resolvedTeamId, localResponsibilities]
  )

  const handleTeamDraftChange = (field, value) => {
    setTeamDraft((previous) => ({ ...previous, [field]: value }))
  }

  const handleToggleTeamMember = (memberId) => {
    setTeamDraft((previous) => {
      const exists = previous.memberIds.includes(memberId)
      return {
        ...previous,
        memberIds: exists
          ? previous.memberIds.filter((currentId) => currentId !== memberId)
          : [...previous.memberIds, memberId],
      }
    })
  }

  const handleCreateTeam = () => {
    const normalizedName = teamDraft.name.trim()
    if (!normalizedName) {
      toast({
        title: "Team name required",
        description: "Please enter a valid team name.",
        variant: DESTRUCTIVE_VARIANT,
      })
      return
    }

    const newTeamId = createTeamId(normalizedName)
    const existingTeam = teams.some((team) => team.id === newTeamId)
    if (existingTeam) {
      toast({
        title: "Team already exists",
        description: "Use a different team name.",
        variant: DESTRUCTIVE_VARIANT,
      })
      return
    }

    createTeamMutation.mutate(
      {
        name: normalizedName,
        leadId: teamDraft.leadId,
        memberIds: teamDraft.memberIds,
      },
      {
        onSuccess: () => {
          setSelectedTeamId(newTeamId)
          setTeamDraft(EMPTY_TEAM_DRAFT)
        },
      }
    )
  }

  const handleTeamResponsibilityChange = (_teamId, moduleKey, value) => {
    setLocalResponsibilities((previous) => ({
      ...previous,
      [moduleKey]: value,
    }))
  }

  const handleSaveRoles = () => {
    updateResponsibilitiesMutation.mutate({
      id: resolvedTeamId,
      responsibilities: localResponsibilities,
    })
  }

  const handleDeleteTeam = (teamId) => {
    deleteTeamMutation.mutate(teamId, {
      onSuccess: () => {
        if (resolvedTeamId === teamId) {
          setSelectedTeamId("")
        }
      },
    })
  }

  const handleRemoveTeamMember = (teamId, memberId) => {
    removeTeamMemberMutation.mutate({ teamId, memberId })
  }

  return {
    teams: teamsWithLocalEdits,
    selectedTeamId: resolvedTeamId,
    teamDraft,
    onTeamSelect: setSelectedTeamId,
    onTeamDraftChange: handleTeamDraftChange,
    onToggleTeamMember: handleToggleTeamMember,
    onCreateTeam: handleCreateTeam,
    onDeleteTeam: handleDeleteTeam,
    onRemoveTeamMember: handleRemoveTeamMember,
    onTeamResponsibilityChange: handleTeamResponsibilityChange,
    onSaveRoles: handleSaveRoles,
  }
}

/**
 * Profile + Settings container — fetches the current user profile, handles
 * profile updates, password changes, and app preference settings.
 */
const ProfilePage = () => {
  const { t } = useTranslation()
  const userName = useSelector((state) => state.user.userName)
  const userRole = useSelector((state) => state.user.userRole)
  const employeeRole = useSelector(
    (state) => state.user.employee_management_role
  )

  // ── Profile state ──────────────────────────────────────────────────────────
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  const { data: profile, isLoading, isError } = useFetchMyProfile()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyProfile()
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword()

  const handleUpdateProfile = (payload) => {
    updateProfile(payload, {
      onSuccess: () => {
        toast({
          title: "Profile updated",
          description: "Your profile has been saved.",
        })
        setIsEditOpen(false)
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: DESTRUCTIVE_VARIANT,
        })
      },
    })
  }

  const handleChangePassword = (payload) => {
    changePassword(payload, {
      onSuccess: () => {
        toast({
          title: "Password changed",
          description: "Your password has been updated successfully.",
        })
        setIsPasswordOpen(false)
      },
      onError: () => {
        toast({
          title: "Error",
          description:
            "Failed to change password. Check your current password.",
          variant: DESTRUCTIVE_VARIANT,
        })
      },
    })
  }

  // ── Settings state ─────────────────────────────────────────────────────────
  const { theme, setTheme } = useTheme()
  const { data: settingsData } = useFetchSettings()
  const { mutate: saveSettings } = useUpdateSettings()

  const notifications = settingsData?.notifications ?? {
    emailAlerts: true,
    leaveUpdates: true,
    projectUpdates: true,
    attendanceReminders: false,
    weeklyDigest: true,
  }

  const teamState = useTeamManagement()

  const currentLanguage = i18n.language?.startsWith("hi") ? "hi" : "en"
  const isAdmin = employeeRole === "admin" || userRole === "admin"

  const { data: employeesData } = useFetchEmployees()
  const employees = employeesData?.employees ?? []

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    toast({
      title: t("Theme updated"),
      description: `Theme set to ${newTheme}.`,
    })
  }

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang)
    toast({
      title: t("Language updated"),
      description: `Language set to ${lang === "en" ? "English" : "Hindi"}.`,
    })
  }

  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] }
    saveSettings({ notifications: updated })
  }

  return (
    <ProfileUI
      profile={profile}
      userName={userName}
      userRole={userRole}
      isLoading={isLoading}
      isError={isError}
      isEditOpen={isEditOpen}
      isPasswordOpen={isPasswordOpen}
      isUpdating={isUpdating}
      isChangingPassword={isChangingPassword}
      onOpenEdit={() => setIsEditOpen(true)}
      onCloseEdit={() => setIsEditOpen(false)}
      onOpenPassword={() => setIsPasswordOpen(true)}
      onClosePassword={() => setIsPasswordOpen(false)}
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={handleChangePassword}
      theme={theme}
      currentLanguage={currentLanguage}
      notifications={notifications}
      isAdmin={isAdmin}
      employees={employees}
      onThemeChange={handleThemeChange}
      onLanguageChange={handleLanguageChange}
      onNotificationToggle={handleNotificationToggle}
      {...teamState}
    />
  )
}

export default ProfilePage
