/**
 * Form utility functions for validation and state management
 */

// ============================================================================
// Types
// ============================================================================

export interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean
  message: string
}

export interface FieldError {
  field: string
  message: string
}

export type FormErrors<T> = Partial<Record<keyof T, string>>

// ============================================================================
// Validation Rules Factory
// ============================================================================

export const validators = {
  /**
   * Validates that a value is not empty
   */
  required: (message = 'This field is required'): ValidationRule<string> => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),

  /**
   * Validates minimum string length
   */
  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length >= min,
    message: message ?? `Must be at least ${min} characters`,
  }),

  /**
   * Validates maximum string length
   */
  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length <= max,
    message: message ?? `Must be at most ${max} characters`,
  }),

  /**
   * Validates email format
   */
  email: (message = 'Invalid email address'): ValidationRule<string> => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  /**
   * Validates that a number is positive
   */
  positiveNumber: (
    message = 'Must be a positive number'
  ): ValidationRule<string | number> => ({
    validate: (value) => {
      const num = typeof value === 'string' ? parseFloat(value) : value
      return !Number.isNaN(num) && num > 0
    },
    message,
  }),

  /**
   * Validates that a number is non-negative (0 or positive)
   */
  nonNegativeNumber: (
    message = 'Must be 0 or greater'
  ): ValidationRule<string | number> => ({
    validate: (value) => {
      const num = typeof value === 'string' ? parseFloat(value) : value
      return !Number.isNaN(num) && num >= 0
    },
    message,
  }),

  /**
   * Validates a value matches a regex pattern
   */
  pattern: (
    regex: RegExp,
    message = 'Invalid format'
  ): ValidationRule<string> => ({
    validate: (value) => regex.test(value),
    message,
  }),

  /**
   * Validates a date string (YYYY-MM-DD format)
   */
  date: (message = 'Invalid date'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return false
      const date = new Date(value)
      return !Number.isNaN(date.getTime())
    },
    message,
  }),
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates a single field value against an array of rules
 * Returns the first error message or undefined if valid
 */
export function validateField<T>(
  value: T,
  rules: ValidationRule<T>[]
): string | undefined {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message
    }
  }
  return undefined
}

/**
 * Validates all fields in a form values object
 * Returns an object with field names as keys and error messages as values
 */
export function validateForm<T extends Record<string, unknown>>(
  values: T,
  schema: Partial<Record<keyof T, ValidationRule<unknown>[]>>
): FormErrors<T> {
  const errors: FormErrors<T> = {}

  for (const field of Object.keys(schema) as (keyof T)[]) {
    const rules = schema[field]
    if (rules) {
      const error = validateField(values[field], rules)
      if (error) {
        errors[field] = error
      }
    }
  }

  return errors
}

/**
 * Checks if form has any validation errors
 */
export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.keys(errors).length > 0
}

// ============================================================================
// Form State Helpers
// ============================================================================

/**
 * Creates a change handler for form inputs
 * Works with standard HTML input events
 */
export function createChangeHandler<T extends Record<string, unknown>>(
  setValues: React.Dispatch<React.SetStateAction<T>>
) {
  return (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setValues((prev) => ({
      ...prev,
      [name]: type === 'number' ? value : value,
    }))
  }
}

/**
 * Creates a field setter for programmatic updates
 */
export function createFieldSetter<T extends Record<string, unknown>>(
  setValues: React.Dispatch<React.SetStateAction<T>>
) {
  return (field: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }
}

/**
 * Checks if form values have changed from initial values
 */
export function isDirty<T extends object>(
  values: T,
  initialValues: T
): boolean {
  return (Object.keys(values) as (keyof T)[]).some(
    (key) => values[key] !== initialValues[key]
  )
}

/**
 * Resets form values to initial state
 */
export function resetForm<T>(
  setValues: React.Dispatch<React.SetStateAction<T>>,
  initialValues: T
) {
  setValues(initialValues)
}
