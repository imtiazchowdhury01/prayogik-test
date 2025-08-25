import React, { useState } from "react";

interface CategorySelectionModalProps {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void; // Callback to handle selection
  isOpen: boolean; // Prop to control modal visibility
  onClose: () => void; // Prop to close the modal
}

export const CategorySelectionModal = ({
  options,
  isOpen,
  onClose,
  onSelect,
}: CategorySelectionModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null; // Do not render anything if not open

  // Filter options based on the search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-1/3">
        <h2 className="text-lg font-semibold mb-2">Select a Category</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-500"
        />

        <ul className="space-y-2">
          {filteredOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => {
                  onSelect(option.value);
                  onClose(); // Close modal after selection
                }}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
