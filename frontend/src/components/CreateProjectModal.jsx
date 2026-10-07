import React, { useState } from "react";
import {
  useCreateProject,
  useMyOrgs,
  useCreateOrg,
} from "../hooks/useProjects";
import { X, Loader2 } from "lucide-react";

export default function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: orgs } = useMyOrgs();
  const createProject = useCreateProject();
  const createOrg = useCreateOrg();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !key) {
      setError("Name and Key are required");
      return;
    }

    try {
      setIsCreating(true);
      let targetOrgId = orgs?.[0]?._id;
      // If no org exists, create a default one
      if (!targetOrgId) {
        const newOrg = await createOrg.mutateAsync({
          name: "My Organization",
          slug: `org-${Date.now()}`,
        });
        targetOrgId = newOrg._id;
      }
      const newProj = await createProject.mutateAsync({
        orgId: targetOrgId,
        name,
        key: key.toUpperCase(),
        desc,
      });
      onSuccess(newProj._id);
      // Reset form
      setName("");
      setKey("");
      setDesc("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div className="card" style={{ width: "480px", position: "relative" }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            color: "var(--mute)",
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: "24px", marginBottom: "var(--spacing-xl)" }}>
          Create Project
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-md)",
          }}
        >
          {error && (
            <div
              style={{
                color: "var(--accent-sunset)",
                fontSize: "14px",
                padding: "8px",
                backgroundColor: "rgba(255,122,23,0.1)",
                borderRadius: "4px",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "var(--mute)",
              }}
            >
              Project Name
            </label>
            <input
              className="input"
              placeholder="e.g. Mobile App"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Auto-generate key if empty or matches previous auto-generation
                if (
                  !key ||
                  e.target.value.substring(0, 3).toUpperCase() ===
                    key + e.nativeEvent.data?.toUpperCase()
                ) {
                  setKey(e.target.value.substring(0, 3).toUpperCase());
                }
              }}
              required
              autoFocus
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "var(--mute)",
              }}
            >
              Project Key
            </label>
            <input
              className="input"
              placeholder="e.g. MOB"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              required
              maxLength={10}
            />

            <div
              className="mono-caption"
              style={{ marginTop: "4px", fontSize: "10px" }}
            >
              Used as prefix for tasks (e.g. {key || "MOB"}-123)
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "var(--mute)",
              }}
            >
              Description (Optional)
            </label>
            <textarea
              className="input"
              placeholder="What is this project about?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "var(--spacing-md)",
            }}
          >
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isCreating}>
              {isCreating ? (
                <Loader2 className="spin" size={16} />
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
