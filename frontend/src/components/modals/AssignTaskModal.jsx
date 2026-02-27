import { useState } from "react";
import { taskService } from "../../services/task.service";
import Button from "../reusables/Button";

const AssignTaskModal = ({ isOpen, onClose, onSuccess, users }) => {
  const [assignForm, setAssignForm] = useState({
    title: "",
    description: "",
    assignedUser: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  if (!isOpen) return null;

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);
    try {
      await taskService.assignTask(assignForm);
      setAssignForm({ title: "", description: "", assignedUser: "" });
      onSuccess();
      onClose();
    } catch (error) {
      setModalError(error.response?.data?.message || "Task assignment failed");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Assign New Task</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-black cursor-pointer"
          >
            ✕
          </button>
        </div>

        {modalError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {modalError}
          </div>
        )}

        <form onSubmit={handleAssignTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-800 mb-1">
              Task Title
            </label>
            <input
              required
              type="text"
              value={assignForm.title}
              onChange={(e) =>
                setAssignForm({ ...assignForm, title: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800 mb-1">
              Description
            </label>
            <textarea
              required
              rows="3"
              value={assignForm.description}
              onChange={(e) =>
                setAssignForm({ ...assignForm, description: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900/10 resize-none"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800 mb-1">
              Assign To (Username)
            </label>
            <div className="relative">
              <select
                required
                value={assignForm.assignedUser}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, assignedUser: e.target.value })
                }
                className="w-full appearance-none px-4 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900/10 bg-white cursor-pointer"
              >
                <option value="" disabled>
                  Select a user...
                </option>
                {users.map((u) => (
                  <option key={u._id} value={u.username}>
                    {u.username} ({u.email})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-1.5 font-medium bg-white text-zinc-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={modalLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 border-none text-white"
            >
              {modalLoading ? "Assigning..." : "Assign Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;
