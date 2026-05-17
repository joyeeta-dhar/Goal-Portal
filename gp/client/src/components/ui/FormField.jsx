// client/src/components/ui/FormField.jsx
// Reusable labelled form fields with inline error display.
// Used by GoalForm and any other forms in the app.

/**
 * FormField wrapper — label + input + error message
 */
export const FormField = ({ label, required, error, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="text-[11px] text-gray-400">{hint}</p>
    )}
    {error && (
      <p className="text-[11px] text-red-600 flex items-center gap-1">
        <i className="ti ti-alert-circle text-[12px]" aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
);

/**
 * Text input
 */
export const Input = ({ error, className = '', ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2 text-[13px] border rounded-lg outline-none transition-colors
      ${error
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
      }
      placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
      ${className}`}
  />
);

/**
 * Textarea
 */
export const Textarea = ({ error, className = '', ...props }) => (
  <textarea
    {...props}
    rows={props.rows || 3}
    className={`w-full px-3 py-2 text-[13px] border rounded-lg outline-none transition-colors resize-none
      ${error
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
      }
      placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
      ${className}`}
  />
);

/**
 * Select dropdown
 */
export const Select = ({ error, children, className = '', ...props }) => (
  <select
    {...props}
    className={`w-full px-3 py-2 text-[13px] border rounded-lg outline-none transition-colors bg-white
      ${error
        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
      }
      disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
      ${className}`}
  >
    {children}
  </select>
);

/**
 * Character counter for textarea
 */
export const CharCount = ({ current, max }) => (
  <p className={`text-[11px] text-right -mt-1 ${current > max ? 'text-red-500' : 'text-gray-400'}`}>
    {current}/{max}
  </p>
);
