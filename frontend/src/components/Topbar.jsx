import { Bell } from 'lucide-react';

export default function Topbar() {
  // En un caso real usaríamos date-fns o similar
  const dateStr = "Lunes, 15 De Junio De 2026";
  const timeStr = "08:20";

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-8 flex justify-between items-center shrink-0">
      <div className="flex flex-col text-sm text-gray-800 font-medium">
        <span>{dateStr}</span>
        <span className="text-gray-500">{timeStr}</span>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-500 hover:text-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
            11
          </span>
        </button>
        
        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 font-medium hover:bg-gray-50 transition-colors">
          T
        </button>
      </div>
    </header>
  );
}
