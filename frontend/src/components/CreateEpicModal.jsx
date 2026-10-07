import React, { useState } from "react";
import { useCreateEpic } from "../hooks/useBacklog";
import { X, Loader2 } from "lucide-react";

export default function CreateEpicModal({
  isOpen,
  onClose,
  orgId,
  projectId,
  requirements = [],
  defaultReqId = "",
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirementId, setRequirementId] = useState(defaultReqId);
  const [error, setError] = useState("");

  const createEpic = useCreateEpic();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title) {
      setError("Title is required");
      return;
    }

    try {
      await createEpic.mutateAsync({
        orgId,
        projectId,
        data: {
          title,
          description,
          requirementId: requirementId || undefined,
        },
      });
      setTitle("");
      setDescription("");
      setRequirementId(defaultReqId);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create epic");
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
          Create Epic
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
              Epic Title
            </label>
            <input
              className="input"
              placeholder="e.g. User Authentication"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              Trace to Requirement (Optional)
            </label>
            <select
              className="input"
              value={requirementId}
              onChange={(e) => setRequirementId(e.target.value)}
            >
              <option value="">-- None --</option>
              {requirements.map((req) => (
                <option key={req._id} value={req._id}>
                  {req.key}: {req.title}
                </option>
              ))}
            </select>
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
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
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
            <button
              type="submit"
              className="btn-primary"
              disabled={createEpic.isPending}
            >
              {createEpic.isPending ? (
                <Loader2 className="spin" size={16} />
              ) : (
                "Create Epic"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
