import React, { useState } from "react";
import { useCreateTask } from "../hooks/useAgile";
import { X, Loader2 } from "lucide-react";

export default function CreateTaskModal({ isOpen, onClose, orgId, projectId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [storyPoints, setStoryPoints] = useState("");
  const [error, setError] = useState("");

  const createTask = useCreateTask();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title) {
      setError("Title is required");
      return;
    }

    try {
      await createTask.mutateAsync({
        orgId,
        projectId,
        data: {
          title,
          description,
          priority,
          storyPoints: storyPoints === "" ? undefined : Number(storyPoints),
        },
      });
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setStoryPoints("");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create task");
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
          Create Task
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
              Task Title
            </label>
            <input
              className="input"
              placeholder="What needs to be done?"
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
              Description (Optional)
            </label>
            <textarea
              className="input"
              placeholder="Add more details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
                Priority
              </label>
              <select
                className="input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
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
                Story Points
              </label>
              <input
                className="input"
                type="number"
                min="0"
                max="100"
                value={storyPoints}
                onChange={(e) =>
                  setStoryPoints(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="e.g. 5"
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
              disabled={createTask.isPending}
            >
              {createTask.isPending ? (
                <Loader2 className="spin" size={16} />
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
