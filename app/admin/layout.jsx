import Sidebar from "@/components/Sidebar";
import "../globals.css";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-orange-50/30">
            <div className="flex">
                <Sidebar role="admin" />
                <div className="flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
