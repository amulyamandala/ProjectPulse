import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  Kanban,
  Settings,
  Target,
  ShieldAlert,
} from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Backlog", path: "/backlog", icon: ListTodo },
    { name: "Active Sprint", path: "/board", icon: Kanban },
    { name: "Issues", path: "/issues", icon: ShieldAlert },
    { name: "Milestones", path: "/milestones", icon: Target },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--canvas)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          backgroundColor: "var(--canvas-soft)",
          borderRight: "1px solid var(--hairline)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "var(--spacing-xl)",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <div
            className="navbar-brand"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "var(--ink)",
                borderRadius: "4px",
              }}
            ></div>
            ProjectPulse
          </div>
        </div>

        <nav
          style={{
            padding: "var(--spacing-md)",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div className="mono-caption" style={{ padding: "8px 12px" }}>
            Project Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "var(--rounded-sm)",
                  backgroundColor: isActive
                    ? "var(--canvas-mid)"
                    : "transparent",
                  color: isActive ? "var(--ink)" : "var(--mute)",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            padding: "var(--spacing-md)",
            borderTop: "1px solid var(--hairline)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "var(--canvas-mid)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              U
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>User</div>
              <div style={{ fontSize: "12px", color: "var(--mute)" }}>
                My Account
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}
