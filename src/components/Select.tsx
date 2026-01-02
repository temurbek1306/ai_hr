import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
    label,
    error,
    options,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    className={`
                        w-full px-4 py-3 pr-10
                        bg-white 
                        border ${error ? 'border-red-500' : 'border-gray-300'} 
                        rounded-xl 
                        text-gray-900
                        focus:outline-none 
                        focus:ring-2 
                        ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'}
                        focus:border-transparent
                        transition-all duration-200
                        appearance-none
                        cursor-pointer
                        ${className}
                    `}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-white text-gray-900">
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={20} />
                </div>
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600">{error}</p>
            )}
        </div>
    )
})

Select.displayName = 'Select'

export default Select
