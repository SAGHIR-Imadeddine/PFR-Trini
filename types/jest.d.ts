// Import the types from testing-library/jest-dom
import '@testing-library/jest-dom';

// Extend the Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeInvalid(): R;
      toBeVisible(): R;
      toBeChecked(): R;
      toHaveValue(value: any): R;
      toHaveAttribute(attr: string, value?: any): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveStyle(css: Record<string, any>): R;
      toContainElement(element: HTMLElement | null): R;
    }
  }
} 