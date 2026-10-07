import React, { useState } from "react";
import { useCreateUserStory } from "../hooks/useBacklog";
import { X, Loader2 } from "lucide-react";

export default function CreateUserStoryModal({
  isOpen,
  onClose,
  orgId,
  projectId,
  epics = [],
  defaultEpicId = "",
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [epicId, setEpicId] = useState(defaultEpicId);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
  const [storyPoints, setStoryPoints] = useState("");
  const [error, setError] = useState("");

  const createStory = useCreateUserStory();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title) {
      setError("Title is required");
      return;
    }

    try {
      await createStory.mutateAsync({
        orgId,
        projectId,
        data: {
          title,
          description,
          epicId: epicId || undefined,
          acceptanceCriteria,
          storyPoints: storyPoints === "" ? undefined : Number(storyPoints),
        },
      });
      setTitle("");
      setDescription("");
      setAcceptanceCriteria("");
      setStoryPoints("");
      setEpicId(defaultEpicId);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create user story");
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
      <div
        className="card"
        style={{
          width: "480px",
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
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
          Create User Story
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
              Story Title
            </label>
            <input
              className="input"
              placeholder="As a user, I want to..."
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
              Trace to Epic (Optional)
            </label>
            <select
              className="input"
              value={epicId}
              onChange={(e) => setEpicId(e.target.value)}
            >
              <option value="">-- None --</option>
              {epics.map((epic) => (
                <option key={epic._id} value={epic._id}>
                  {epic.title}
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
              Description
            </label>
            <textarea
              className="input"
              placeholder="Context..."
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
              Acceptance Criteria
            </label>
            <textarea
              className="input"
              placeholder="Given... When... Then..."
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
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
              placeholder="e.g. 3"
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
              disabled={createStory.isPending}
            >
              {createStory.isPending ? (
                <Loader2 className="spin" size={16} />
              ) : (
                "Create Story"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
