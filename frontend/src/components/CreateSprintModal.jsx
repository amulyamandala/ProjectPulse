import React, { useState } from "react";
import { useCreateSprint } from "../hooks/useAgile";
import { X, Loader2 } from "lucide-react";

export default function CreateSprintModal({
  isOpen,
  onClose,
  orgId,
  projectId,
}) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  // Set default dates: start today, end in 14 days
  const today = new Date();
  const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(twoWeeks.toISOString().split("T")[0]);
  const [error, setError] = useState("");

  const createSprint = useCreateSprint();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !startDate || !endDate) {
      setError("Name and dates are required");
      return;
    }

    try {
      await createSprint.mutateAsync({
        orgId,
        projectId,
        data: {
          name,
          goal,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        },
      });
      setName("");
      setGoal("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create sprint");
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
          Create Sprint
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
              Sprint Name
            </label>
            <input
              className="input"
              placeholder="e.g. Sprint 1"
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
              Goal (Optional)
            </label>
            <textarea
              className="input"
              placeholder="What is the main objective?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={2}
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "var(--mute)",
                }}
              >
                Start Date
              </label>
              <input
                className="input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  color: "var(--mute)",
                }}
              >
                End Date
              </label>
              <input
                className="input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
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
              disabled={createSprint.isPending}
            >
              {createSprint.isPending ? (
                <Loader2 className="spin" size={16} />
              ) : (
                "Create Sprint"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
