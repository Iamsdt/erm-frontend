import { http, HttpResponse } from "msw"

// ─── Seed data ────────────────────────────────────────────────────────────────

/** In-memory employee store — mutated by create/update/delete handlers */
let employees = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 555 000 0001",
    department: "Engineering",
    role: "employee",
    joinDate: "2022-03-01",
    status: "active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 555 000 0002",
    department: "Design",
    role: "employee",
    joinDate: "2021-06-15",
    status: "active",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@example.com",
    phone: "+1 555 000 0003",
    department: "HR",
    role: "manager",
    joinDate: "2020-01-10",
    status: "inactive",
  },
  {
    id: 4,
    name: "Dave Brown",
    email: "dave@example.com",
    phone: "",
    department: "Marketing",
    role: "employee",
    joinDate: "2023-09-01",
    status: "invited",
  },
  {
    id: 5,
    name: "Eva Martinez",
    email: "eva@example.com",
    phone: "+1 555 000 0005",
    department: "Finance",
    role: "admin",
    joinDate: "2019-11-20",
    status: "active",
  },
]

let nextId = employees.length + 1

// ─── GET /employee-management/ ────────────────────────────────────────────────

const listEmployees = http.get("*/employee-management/", () => {
  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    inactive: employees.filter((e) => e.status === "inactive").length,
    invited: employees.filter((e) => e.status === "invited").length,
  }
  return HttpResponse.json({ employees, stats })
})

// ─── GET /employee-management/:id/ ───────────────────────────────────────────

const getEmployee = http.get("*/employee-management/:id/", ({ params }) => {
  const employee = employees.find((e) => e.id === Number(params.id))
  if (!employee) {
    return HttpResponse.json({ detail: "Not found." }, { status: 404 })
  }
  return HttpResponse.json(employee)
})

// ─── POST /employee-management/ ───────────────────────────────────────────────

const createEmployee = http.post(
  "*/employee-management/",
  async ({ request }) => {
    const body = await request.json()
    const newEmployee = {
      id: nextId++,
      status: "active",
      ...body,
    }
    employees = [...employees, newEmployee]
    return HttpResponse.json(newEmployee, { status: 201 })
  }
)

// ─── PATCH /employee-management/:id/ ─────────────────────────────────────────

const updateEmployee = http.patch(
  "*/employee-management/:id/",
  async ({ params, request }) => {
    const body = await request.json()
    const idx = employees.findIndex((e) => e.id === Number(params.id))
    if (idx === -1) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 })
    }
    employees[idx] = { ...employees[idx], ...body }
    return HttpResponse.json(employees[idx])
  }
)

// ─── DELETE /employee-management/:id/ ────────────────────────────────────────

const removeEmployee = http.delete(
  "*/employee-management/:id/",
  ({ params }) => {
    const idx = employees.findIndex((e) => e.id === Number(params.id))
    if (idx === -1) {
      return HttpResponse.json({ detail: "Not found." }, { status: 404 })
    }
    employees = employees.filter((e) => e.id !== Number(params.id))
    return HttpResponse.json({ detail: "Deleted." })
  }
)

// ─── POST /employee-management/invite/ ───────────────────────────────────────

const inviteUser = http.post(
  "*/employee-management/invite/",
  async ({ request }) => {
    const body = await request.json()
    const invited = {
      id: nextId++,
      name: body.email.split("@")[0], // placeholder until they fill in their profile
      email: body.email,
      phone: "",
      department: body.department ?? "",
      role: body.role ?? "employee",
      joinDate: new Date().toISOString().split("T")[0],
      status: "invited",
    }
    employees = [...employees, invited]
    return HttpResponse.json(
      { detail: `Invitation sent to ${body.email}.`, employee: invited },
      { status: 201 }
    )
  }
)

const handlers = [
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  removeEmployee,
  inviteUser,
]

export default handlers
