## 💡 How much time did you spend on the engineering task?
- 9Hours
| Activity | Description | Time Spent |
|-----------|--------------|-------------|
| 📖 Code Walkthrough / Understanding | Reviewed project structure and understood existing component interactions before implementation. | 1 hr |
| 🔼 React Upgrade | Upgraded project to **React 18** and resolved related compatibility issues. | 1.5 hrs |
| 🧪 Unit Test Cases | Wrote and refactored **unit tests** for multiple components using Jest and Testing Library. | 2 hrs |
| 🎨 Theme Issue Fix | Fixed theme rendering issue and ensured consistent dark/light mode behavior. | 1 hr |
| 📏 Resizable Container | Fixed container **resizing behavior** for smooth drag and resize interaction. | 1.5 hrs |
| 🪟 Z-Index Behavior | Fixed issue where **backside container** overlaps; now it comes to front on click (z-index solution). | 0.5 hr |
| ⚙️ Constants Refactor | Created and organized a **constants file** for reusable messages and static values. | 0.75 hr |
| 📝 Documentation | Created `answers.md` and added structured explanations for design and improvement points. | 0.75 hr |

## 💡 What I would add or improve if I had more time?

**🧪 Cypress Test Cases**
Add **Cypress E2E tests** to check key user flows like login, fruit trading, and panel drag/resize.  
This ensures everything works smoothly in a real browser before going live.

---

**⚡ Lazy Loading & `React.Suspense`**
Use **lazy loading** for heavy pages (like `FruitBook` or `LoginComponent`) so they load only when needed.  
This improves speed and makes the app feel faster.

---

**🧩 Code Splitting**
Split the code into smaller chunks using **Webpack or Vite**.  
Combined with lazy loading, it reduces bundle size and speeds up initial load.

---

**🪝 Custom Hooks**
Move repeated logic (drag, resize, panel state) into **custom hooks**:
- `useDrag()` for movement  
- `useResize()` for resizing panels  
- `usePanelState()` for managing position and size  
This keeps code clean, reusable, and easier to test.

---

**🧷 Better TypeScript Safety**
Remove `any` types and add **strong interfaces**.  
It helps avoid bugs and improves code suggestions and clarity.

---

**🎨 Avoid Inline Styles**
Replace inline styles with **CSS modules** or **Styled Components** for better performance and easier theme management.

---

**🔐 Login & Auth Refactor**
Separate **authentication logic** from the UI.  
Keep `LoginComponent` focused on visuals, and move logic to an `authService.ts` file.  
Makes it cleaner, safer, and ready for real API integration later.


## 💡 How Would You Track Down a Performance Issue in Production?

**1. Identify and Reproduce the Problem**
- Collect metrics and logs from monitoring tools (e.g., Datadog, New Relic).
- Correlate issues with recent deployments or traffic spikes.

**2. Use Browser and Frontend Monitoring Tools**
- Use Chrome DevTools to inspect render and network performance.
- Add Real User Monitoring (RUM) with tools like Elastic APM or Datadog.

**3. Backend & API Layer Profiling**
- Trace slow endpoints and database queries using APM tools.

**4. Analyze Logs and Metrics**
- Review structured logs for warnings, timeouts, or memory spikes.

**5. Audit and Optimize Frontend Code**
- **Lazy load** heavy components and use **code splitting** (`React.lazy`, `Suspense`).
- **Memoize** expensive computations with `useMemo` and `useCallback`.

**6. Validate and Prevent Future Regressions**
- Add **Cypress performance tests** runs for critical pages.

- Have you ever had to do this?
    - No

