import { TitleBar } from "@/components/TitleBar";
import { Home } from "lucide-react";

const DashboardPage = () => {
    return (
        <>
            {/* title bar */}
            <TitleBar title="Dashboard" icon={Home} />

            <h1>Contact Page</h1>
        </>
    );
};

export default DashboardPage;