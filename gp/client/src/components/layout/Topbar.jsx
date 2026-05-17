// client/src/components/layout/Topbar.jsx
// Top navigation bar — title + action buttons

const Topbar = ({ title, subtitle, actions = [] }) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
      <div className="flex-1">
        <h1 className="text-[15px] font-medium text-gray-900 leading-none">{title}</h1>
        {subtitle && (
          <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Action buttons passed as props */}
      <div className="flex items-center gap-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-colors border ${
              action.primary
                ? 'bg-blue-700 text-white border-blue-700 hover:bg-blue-800 disabled:opacity-50'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50'
            }`}
          >
            {action.icon && (
              <i className={`ti ${action.icon} text-[15px]`} aria-hidden="true" />
            )}
            {action.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Topbar;
