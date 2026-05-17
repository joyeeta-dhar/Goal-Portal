// client/src/components/ui/ConfirmDialog.jsx
// Generic confirmation dialog for destructive actions (delete, submit, etc.)

import Modal from './Modal';

/**
 * ConfirmDialog
 * @param {boolean}  isOpen
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {string}   title
 * @param {string}   message
 * @param {string}   confirmLabel  - default "Confirm"
 * @param {string}   variant       - "danger" | "warning" | "primary"
 * @param {boolean}  isLoading
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title       = 'Are you sure?',
  message     = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  variant     = 'danger',
  isLoading   = false,
}) => {
  const variantStyles = {
    danger:  'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    primary: 'bg-blue-700 hover:bg-blue-800 text-white',
  };

  const iconMap = {
    danger:  { icon: 'ti-alert-triangle', bg: 'bg-red-100',   color: 'text-red-600'  },
    warning: { icon: 'ti-alert-circle',   bg: 'bg-amber-100', color: 'text-amber-600' },
    primary: { icon: 'ti-info-circle',    bg: 'bg-blue-100',  color: 'text-blue-600' },
  };

  const ic = iconMap[variant] || iconMap.danger;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title="">
      <div className="flex flex-col items-center text-center pb-2">
        <div className={`w-12 h-12 rounded-full ${ic.bg} flex items-center justify-center mb-4`}>
          <i className={`ti ${ic.icon} text-[22px] ${ic.color}`} aria-hidden="true" />
        </div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">{title}</h3>
        <p className="text-[13px] text-gray-500 max-w-xs leading-relaxed">{message}</p>
      </div>

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="flex-1 py-2 text-[13px] font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${variantStyles[variant]}`}
        >
          {isLoading && (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
