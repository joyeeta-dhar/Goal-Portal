// client/src/components/layout/DashboardLayout.jsx
// Shared shell: sidebar + main content area.
// All dashboard pages render inside <DashboardLayout>.

import Sidebar from './Sidebar';

const DashboardLayout = ({ children, goalCount, commentCount }) => {
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <Sidebar goalCount={goalCount} commentCount={commentCount} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
