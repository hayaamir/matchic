import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex items-center w-full max-w-4xl border rounded-full shadow-sm hover:shadow-md transition-shadow p-2 bg-white">
      <button className="bg-[#FF385C] p-3 rounded-full text-white hover:bg-[#E31C5F] transition ml-2">
        <Search size={18} strokeWidth={3} />
      </button>
    </div>
  );
}
