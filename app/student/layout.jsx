import Sidebar from "@/components/Sidebar";
import "../globals.css";

export default function StudentLayout({ children }) {
    return (
        <div className="min-h-screen bg-orange-50/30">
            <div className="flex">
                <Sidebar role="siswa" />
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
