import React, { useState, useEffect } from "react";
import { useMyOrgs, useProjects } from "../hooks/useProjects";
import { useMilestones } from "../hooks/useMilestones";
import { Loader2, Flag } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import CreateMilestoneModal from "../components/CreateMilestoneModal";

export default function Milestones() {
  const { data: orgs, isLoading: loadingOrgs } = useMyOrgs();
  const currentOrg = orgs?.[0];
  const { data: projects, isLoading: loadingProjects } = useProjects(
    currentOrg?._id,
  );
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (projects && projects.length > 0 && !projectId) {
      setProjectId(projects[0]._id);
    }
  }, [projects, projectId]);

  const { data: milestones, isLoading: loadingMilestones } = useMilestones(
    currentOrg?._id,
    projectId,
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (loadingOrgs || loadingProjects)
    return (
      <div style={{ padding: "var(--spacing-4xl)" }}>
        <Loader2 className="spin" />
      </div>
    );

  if (!projects || projects.length === 0) {
    return (
      <div style={{ padding: "var(--spacing-4xl)" }}>
        Please create a project first on the Dashboard.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "var(--spacing-3xl)",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          marginBottom: "var(--spacing-3xl)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1 style={{ fontSize: "32px", marginBottom: "var(--spacing-xs)" }}>
            Milestones
          </h1>
          <p style={{ color: "var(--mute)", fontSize: "14px" }}>
            Track major project phases and releases.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-md)",
            alignItems: "center",
          }}
        >
          <select
            className="input"
            style={{ width: "200px", padding: "8px 12px" }}
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            + Create Milestone
          </button>
        </div>
      </header>

      {loadingMilestones ? (
        <Loader2 className="spin" size={32} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "var(--spacing-xl)",
          }}
        >
          {milestones?.map((milestone) => {
            const targetDate = new Date(milestone.targetDate);
            const isOverdue =
              targetDate < new Date() && milestone.status !== "COMPLETED";

            return (
              <div
                key={milestone._id}
                className="card"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "var(--spacing-lg)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "var(--canvas-mid)",
                        padding: "8px",
                        borderRadius: "50%",
                      }}
                    >
                      <Flag size={20} color="var(--accent-dusk)" />
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: 600 }}>
                      {milestone.name}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: isOverdue
                        ? "rgba(239,68,68,0.1)"
                        : "var(--canvas-mid)",
                      color: isOverdue ? "#ef4444" : "var(--mute)",
                    }}
                  >
                    {isOverdue ? "OVERDUE" : milestone.status}
                  </span>
                </div>

                {milestone.description && (
                  <p
                    style={{
                      color: "var(--body-mid)",
                      fontSize: "14px",
                      marginBottom: "var(--spacing-xl)",
                      flex: 1,
                    }}
                  >
                    {milestone.description}
                  </p>
                )}

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "var(--spacing-md)",
                    borderTop: "1px solid var(--hairline)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: "14px", color: "var(--mute)" }}>
                    Target:{" "}
                    <span style={{ color: "var(--ink)" }}>
                      {format(targetDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: isOverdue ? "#ef4444" : "var(--accent-sunset)",
                    }}
                  >
                    {formatDistanceToNow(targetDate, { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          })}
          {(!milestones || milestones.length === 0) && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "var(--spacing-3xl)",
                color: "var(--mute)",
                backgroundColor: "var(--canvas-soft)",
                borderRadius: "var(--rounded)",
              }}
            >
              No milestones created yet.
            </div>
          )}
        </div>
      )}

      {currentOrg && projectId && (
        <CreateMilestoneModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          orgId={currentOrg._id}
          projectId={projectId}
        />
      )}
    </div>
  );
}
