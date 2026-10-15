<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend Code Style & Architecture Rules

## 1. Strict ES6+ Modern JavaScript Only
- NEVER use legacy ES5 code or deprecated patterns.
- NEVER use `var`. Always use `const` (preferred) or `let` when reassignment is explicitly necessary.
- Use ES6 module syntax (`import` / `export`) consistently.

## 2. Mandatory Arrow Functions
- ALWAYS use ES6 arrow functions (`const Component = () => { ... }`) for:
  - React Page components (`const Page = () => { ... }; export default Page;`)
  - React UI components, Layouts, and Modals
  - Subcomponents, dialogs, and helper functions
  - Custom Hooks (`export const useAuth = () => { ... }`)
  - Context Providers (`export const AuthProvider = ({ children }) => { ... }`)
  - Event handlers, callbacks, and inline closures
  - `forwardRef` definitions: `forwardRef((props, ref) => ...)`
- NEVER use traditional `function` keyword declarations (`function foo() {}` or `export default function Bar() {}`).

## 3. Mandatory Optional Chaining (`?.`)
- ALWAYS use optional chaining (`?.`) wherever access may encounter `null` or `undefined`:
  - **API Responses & Payloads**: `response?.data?.data`, `err?.response?.data?.message`, `result?.token`
  - **Nested Object Properties**: `user?.name`, `user?.email`, `budget?.category?.name`, `transaction?.category?.name`
  - **Array Methods & Length Checks**: `items?.map(...)`, `list?.filter(...)`, `items?.length || 0`, `array?.some?.(...)`
  - **Callback Invocations & Event Handlers**: `onSubmit?.(payload)`, `onClose?.()`, `onEdit?.(item)`, `onConfirm?.(id)`
  - **Browser & Environment APIs**: `window?.matchMedia?.(...)?.matches`, `window?.dispatchEvent?.(...)`
