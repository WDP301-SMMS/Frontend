import React from 'react';
import { utils } from '../../../libs/utils/helpers';

export const RoleSelector = ({ selectedRole, setSelectedRole }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        Select Your Role
      </h3>
      <div className="flex flex-wrap gap-3">
        {["parent", "nurse", "student"].map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              selectedRole === role
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span>{utils.getRoleIcon(role)}</span>
            <span className="capitalize">{role}</span>
          </button>
        ))}
      </div>
    </div>
  );
};