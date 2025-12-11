import { ThemeToggle } from '../components/ui/theme-toggle';

function ThemeToggleDemo() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">
          Theme Toggle
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Click to toggle between dark and light mode
        </p>
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default ThemeToggleDemo;
