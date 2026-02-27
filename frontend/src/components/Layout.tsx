import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useTheme } from '../ThemeContext';
import { TaskModal } from './TaskModal';
import { cn } from '../lib/utils';

export function Layout() {
  const { theme } = useTheme();

  return (
    <div className={cn(
      "flex h-screen overflow-hidden transition-colors duration-300",
      theme === 'dark' ? "bg-[#0f172a]" : "bg-white"
    )}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 relative">
        <div className={cn(
          "absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20",
          theme === 'dark' ? "bg-indigo-500" : "bg-indigo-200"
        )} />
        <Outlet />
      </main>
      <TaskModal />
    </div>
  );
}
