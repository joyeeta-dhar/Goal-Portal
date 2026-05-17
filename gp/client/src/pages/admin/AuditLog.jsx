import DashboardLayout from '../../components/layout/DashboardLayout';
import Topbar from '../../components/layout/Topbar';
import { AUDIT_EVENTS } from './adminData';

const AuditLog = () => (
  <DashboardLayout>
    <Topbar title="Audit log" subtitle="System actions and review activity" />

    <div className="flex-1 overflow-y-auto p-6">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {AUDIT_EVENTS.map((event) => (
          <div key={event.id} className="flex items-start gap-3 px-4 py-4 border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <i className="ti ti-shield-check text-[16px] text-blue-600" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-gray-900">{event.action}</p>
              <p className="text-[12px] text-gray-500 mt-1">{event.target}</p>
              <p className="text-[11px] text-gray-400 mt-1">{event.actor} · {new Date(event.time).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AuditLog;
