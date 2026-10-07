import React, { useState, useEffect } from "react";
import { useMyOrgs, useProjects } from "../hooks/useProjects";
import { useBacklog } from "../hooks/useBacklog";
import { Loader2, ListTodo, FileText, Bookmark } from "lucide-react";
import CreateRequirementModal from "../components/CreateRequirementModal";
import CreateEpicModal from "../components/CreateEpicModal";
import CreateUserStoryModal from "../components/CreateUserStoryModal";

export default function Backlog() {
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

  const { data: backlog, isLoading: loadingBacklog } = useBacklog(
    currentOrg?._id,
    projectId,
  );

  const [isReqOpen, setIsReqOpen] = useState(false);
  const [isEpicOpen, setIsEpicOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  const [selectedReq, setSelectedReq] = useState("");
  const [selectedEpic, setSelectedEpic] = useState("");

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
            Backlog
          </h1>
          <p style={{ color: "var(--mute)", fontSize: "14px" }}>
            Manage Requirements, Epics, and User Stories.
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
            onClick={() => setIsReqOpen(true)}
            className="btn-outline"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            + Requirement
          </button>
          <button
            onClick={() => setIsEpicOpen(true)}
            className="btn-outline"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            + Epic
          </button>
          <button
            onClick={() => setIsStoryOpen(true)}
            className="btn-primary"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          >
            + User Story
          </button>
        </div>
      </header>

      {loadingBacklog ? (
        <Loader2 className="spin" size={32} />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-2xl)",
          }}
        >
          {/* Requirements Section */}
          <div className="card">
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "var(--spacing-xl)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FileText size={18} color="var(--accent-breeze)" />
              Requirements ({backlog?.requirements?.length || 0})
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
              }}
            >
              {backlog?.requirements?.map((req) => (
                <div
                  key={req._id}
                  style={{
                    padding: "var(--spacing-md)",
                    backgroundColor: "var(--canvas-soft)",
                    borderRadius: "var(--rounded-sm)",
                    border: "1px solid var(--hairline)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div className="mono-caption">{req.key}</div>
                      <div style={{ fontSize: "16px", fontWeight: 500 }}>
                        {req.title}
                      </div>
                      {req.description && (
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--body-mid)",
                            marginTop: "8px",
                          }}
                        >
                          {req.description}
                        </div>
                      )}
                    </div>
                    <button
                      className="btn-outline"
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                      onClick={() => {
                        setSelectedReq(req._id);
                        setIsEpicOpen(true);
                      }}
                    >
                      + Epic
                    </button>
                  </div>
                </div>
              ))}
              {(!backlog?.requirements ||
                backlog.requirements.length === 0) && (
                <div
                  style={{
                    color: "var(--mute)",
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                >
                  No requirements found.
                </div>
              )}
            </div>
          </div>

          {/* Epics Section */}
          <div className="card">
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "var(--spacing-xl)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Bookmark size={18} color="var(--accent-dusk)" />
              Epics ({backlog?.epics?.length || 0})
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
              }}
            >
              {backlog?.epics?.map((epic) => (
                <div
                  key={epic._id}
                  style={{
                    padding: "var(--spacing-md)",
                    backgroundColor: "var(--canvas-soft)",
                    borderRadius: "var(--rounded-sm)",
                    border: "1px solid var(--hairline)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 500 }}>
                        {epic.title}
                      </div>
                      {epic.description && (
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--body-mid)",
                            marginTop: "8px",
                          }}
                        >
                          {epic.description}
                        </div>
                      )}
                    </div>
                    <button
                      className="btn-outline"
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                      onClick={() => {
                        setSelectedEpic(epic._id);
                        setIsStoryOpen(true);
                      }}
                    >
                      + Story
                    </button>
                  </div>
                </div>
              ))}
              {(!backlog?.epics || backlog.epics.length === 0) && (
                <div
                  style={{
                    color: "var(--mute)",
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                >
                  No epics found.
                </div>
              )}
            </div>
          </div>

          {/* User Stories Section */}
          <div className="card">
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "var(--spacing-xl)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ListTodo size={18} color="var(--accent-sunset)" />
              User Stories ({backlog?.stories?.length || 0})
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
              }}
            >
              {backlog?.stories?.map((story) => (
                <div
                  key={story._id}
                  style={{
                    padding: "var(--spacing-md)",
                    backgroundColor: "var(--canvas-soft)",
                    borderRadius: "var(--rounded-sm)",
                    border: "1px solid var(--hairline)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 500 }}>
                        {story.title}
                      </div>
                      {story.storyPoints && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--accent-sunset)",
                            marginTop: "4px",
                          }}
                        >
                          {story.storyPoints} Points
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(!backlog?.stories || backlog.stories.length === 0) && (
                <div
                  style={{
                    color: "var(--mute)",
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                >
                  No user stories found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentOrg && projectId && (
        <>
          <CreateRequirementModal
            isOpen={isReqOpen}
            onClose={() => setIsReqOpen(false)}
            orgId={currentOrg._id}
            projectId={projectId}
          />

          <CreateEpicModal
            isOpen={isEpicOpen}
            onClose={() => {
              setIsEpicOpen(false);
              setSelectedReq("");
            }}
            orgId={currentOrg._id}
            projectId={projectId}
            requirements={backlog?.requirements}
            defaultReqId={selectedReq}
          />

          <CreateUserStoryModal
            isOpen={isStoryOpen}
            onClose={() => {
              setIsStoryOpen(false);
              setSelectedEpic("");
            }}
            orgId={currentOrg._id}
            projectId={projectId}
            epics={backlog?.epics}
            defaultEpicId={selectedEpic}
          />
        </>
      )}
    </div>
  );
}
