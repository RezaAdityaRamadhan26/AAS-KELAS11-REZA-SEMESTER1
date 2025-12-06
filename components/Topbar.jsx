export default function TopBar({ title = "" }) {
    return (
        <div className="w-full bg-transparent pb-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-orange-600">{title}</h2>
            </div>
        </div>
    );
}
