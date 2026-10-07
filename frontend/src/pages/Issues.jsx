import React, { useState, useEffect } from "react";
import { useMyOrgs, useProjects } from "../hooks/useProjects";
import { useIssues, useUpdateIssueStatus } from "../hooks/useIssues";
import { Loader2, Bug, AlertTriangle, ShieldAlert } from "lucide-react";
import CreateIssueModal from "../components/CreateIssueModal";

export default function Issues() {
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

  const { data: issues, isLoading: loadingIssues } = useIssues(
    currentOrg?._id,
    projectId,
  );
  const updateStatus = useUpdateIssueStatus();

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

  const getSeverityIcon = (sev) => {
    switch (sev) {
      case "CRITICAL":
        return <ShieldAlert size={16} color="#ef4444" />;
      case "HIGH":
        return <AlertTriangle size={16} color="#f97316" />;
      default:
        return <Bug size={16} color="var(--mute)" />;
    }
  };

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
            Issue Tracker
          </h1>
          <p style={{ color: "var(--mute)", fontSize: "14px" }}>
            Track bugs, defects, and QA feedback.
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
            + Report Issue
          </button>
        </div>
      </header>

      {loadingIssues ? (
        <Loader2 className="spin" size={32} />
      ) : (
        <div className="card">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-md)",
            }}
          >
            {issues?.map((issue) => (
              <div
                key={issue._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "var(--spacing-lg)",
                  backgroundColor: "var(--canvas)",
                  borderRadius: "var(--rounded-sm)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "var(--spacing-lg)",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ marginTop: "4px" }}>
                    {getSeverityIcon(issue.severity)}
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      <span className="mono-caption">{issue.key}</span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor:
                            issue.severity === "CRITICAL"
                              ? "rgba(239, 68, 68, 0.1)"
                              : "var(--canvas-mid)",
                          color:
                            issue.severity === "CRITICAL"
                              ? "#ef4444"
                              : "var(--mute)",
                        }}
                      >
                        {issue.severity}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 500,
                        marginBottom: "8px",
                      }}
                    >
                      {issue.title}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "var(--body-mid)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {issue.description}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "8px",
                  }}
                >
                  <select
                    className="input"
                    style={{
                      width: "140px",
                      padding: "4px 8px",
                      fontSize: "12px",
                    }}
                    value={issue.status}
                    onChange={(e) =>
                      updateStatus.mutate({
                        orgId: currentOrg?._id,
                        projectId,
                        issueId: issue._id,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="BACKLOG">Backlog</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="TESTING">Testing</option>
                    <option value="DONE">Done</option>
                  </select>
                  <div style={{ fontSize: "12px", color: "var(--mute)" }}>
                    Reported {new Date(issue.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {(!issues || issues.length === 0) && (
              <div
                style={{
                  textAlign: "center",
                  padding: "var(--spacing-3xl)",
                  color: "var(--mute)",
                }}
              >
                No issues reported yet.
              </div>
            )}
          </div>
        </div>
      )}

      {currentOrg && projectId && (
        <CreateIssueModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          orgId={currentOrg._id}
          projectId={projectId}
        />
      )}
    </div>
  );
}
