import React, { useState } from "react";
import { useCreateMilestone } from "../hooks/useMilestones";
import { X, Loader2 } from "lucide-react";

export default function CreateMilestoneModal({
  isOpen,
  onClose,
  orgId,
  projectId,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // Set default date: 30 days from now
  const thirtyDays = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
  const [targetDate, setTargetDate] = useState(
    thirtyDays.toISOString().split("T")[0],
  );
  const [error, setError] = useState("");

  const createMilestone = useCreateMilestone();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !targetDate) {
      setError("Name and target date are required");
      return;
    }

    try {
      await createMilestone.mutateAsync({
        orgId,
        projectId,
        data: {
          name,
          description,
          targetDate: new Date(targetDate).toISOString(),
        },
      });
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create milestone");
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
          Create Milestone
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
              Milestone Name
            </label>
            <input
              className="input"
              placeholder="e.g. Beta Release v1.0"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              Description (Optional)
            </label>
            <textarea
              className="input"
              placeholder="What are the goals of this milestone?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ resize: "vertical" }}
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
              Target Date
            </label>
            <input
              className="input"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
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
              disabled={createMilestone.isPending}
            >
              {createMilestone.isPending ? (
                <Loader2 className="spin" size={16} />
              ) : (
                "Create Milestone"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
