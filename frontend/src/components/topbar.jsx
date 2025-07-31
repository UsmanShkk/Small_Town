export default function Topbar() {
    return (
      <div className="bg-white shadow-md h-16 flex items-center justify-between px-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Admin</span>
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-10 h-10 rounded-full border"
          />
        </div>
      </div>
    );
  }
  
 