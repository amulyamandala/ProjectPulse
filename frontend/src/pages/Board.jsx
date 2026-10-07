import React, { useState, useEffect } from "react";
import { useMyOrgs, useProjects } from "../hooks/useProjects";
import { useBoard, useUpdateTaskStatus } from "../hooks/useAgile";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const COLUMNS = ["TODO", "IN_PROGRESS", "IN_REVIEW", "TESTING", "DONE"];

export default function Board() {
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

  const { data: boardData, isLoading: loadingBoard } = useBoard(
    currentOrg?._id,
    projectId,
  );
  const updateTaskStatus = useUpdateTaskStatus();

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

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId || !currentOrg?._id || !projectId) return;

    // Check if task is already in this status
    const task = boardData?.tasks?.find((t) => t._id === taskId);
    if (task && task.status !== status) {
      try {
        await updateTaskStatus.mutateAsync({
          orgId: currentOrg._id,
          projectId,
          taskId,
          status,
        });
      } catch (err) {
        alert(err.message || "Failed to update task status");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const sprint = boardData?.sprint;
  const tasks = boardData?.tasks || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "var(--spacing-3xl)",
        maxWidth: "1600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
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
            Active Sprint
          </h1>
          <p style={{ color: "var(--mute)", fontSize: "14px" }}>
            {sprint ? (
              <span>
                {sprint.name} &bull;{" "}
                {new Date(sprint.startDate).toLocaleDateString()} -{" "}
                {new Date(sprint.endDate).toLocaleDateString()}
              </span>
            ) : (
              <span>No active sprint</span>
            )}
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
          {!sprint && (
            <Link
              to="/"
              className="btn-primary"
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Create Sprint on Dashboard
            </Link>
          )}
        </div>
      </header>

      {loadingBoard ? (
        <Loader2 className="spin" size={32} />
      ) : (
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-lg)",
            flex: 1,
            overflowX: "auto",
            paddingBottom: "var(--spacing-xl)",
          }}
        >
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col);
            return (
              <div
                key={col}
                className="card"
                style={{
                  flex: "0 0 300px",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "var(--canvas-soft)",
                  border: "none",
                }}
                onDrop={(e) => handleDrop(e, col)}
                onDragOver={handleDragOver}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "var(--spacing-lg)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--mute)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {col.replace("_", " ")}
                  </h3>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--mute)",
                      backgroundColor: "var(--canvas-mid)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-md)",
                    flex: 1,
                  }}
                >
                  {colTasks.map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      style={{
                        backgroundColor: "var(--canvas)",
                        padding: "var(--spacing-md)",
                        borderRadius: "var(--rounded-sm)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        border: "1px solid var(--hairline)",
                        cursor: "grab",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span className="mono-caption">{task.key}</span>
                        {task.priority === "HIGH" ||
                        task.priority === "URGENT" ? (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#fff",
                              backgroundColor: "#ef4444",
                              padding: "2px 4px",
                              borderRadius: "4px",
                              fontWeight: "bold",
                            }}
                          >
                            {task.priority}
                          </span>
                        ) : null}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginBottom: "12px",
                          lineHeight: "1.4",
                        }}
                      >
                        {task.title}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontSize: "12px", color: "var(--mute)" }}>
                          {task.assigneeId
                            ? `${task.assigneeId.firstName} ${task.assigneeId.lastName}`
                            : "Unassigned"}
                        </div>
                        {task.storyPoints && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "var(--accent-breeze)",
                              fontWeight: 600,
                              backgroundColor: "rgba(29, 161, 242, 0.1)",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {task.storyPoints}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div
                      style={{
                        height: "60px",
                        border: "1px dashed var(--hairline)",
                        borderRadius: "var(--rounded-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--mute)",
                        fontSize: "12px",
                      }}
                    >
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
