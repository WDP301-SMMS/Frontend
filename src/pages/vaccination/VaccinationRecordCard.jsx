import React from 'react';
import { FileText, CheckCircle, Calendar, Syringe, Clock } from 'lucide-react';

export const VaccinationRecordCard = ({ record }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {record.studentName}
            </h3>
            <p className="text-sm text-gray-600">
              ID: {record.studentId} | Class: {record.class}
            </p>
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 self-start sm:self-center">
            <FileText size={16} />
            <span>View Details</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completed Vaccinations */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircle size={16} className="text-green-500 mr-2" />
              Completed Vaccinations
            </h4>
            <div className="space-y-2">
              {record.vaccines.map((vaccine, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    <Syringe size={16} className="text-green-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {vaccine.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {vaccine.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-gray-900">
                      {vaccine.date}
                    </p>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Vaccinations */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Calendar size={16} className="text-blue-500 mr-2" />
              Upcoming Vaccinations
            </h4>
            <div className="space-y-2">
              {record.upcomingVaccines.map((vaccine, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {vaccine.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {vaccine.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-gray-900">
                      {vaccine.scheduledDate}
                    </p>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      Scheduled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};