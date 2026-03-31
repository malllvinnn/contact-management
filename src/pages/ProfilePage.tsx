import { TitleBar } from "@/components/TitleBar";
import { UserForm } from "@/features/user/components/UserForm";
import { User2 } from "lucide-react";

const ProfilePage = () => {

    return (
        <>
            {/* title bar */}
            <TitleBar title="My Profile" icon={User2} backButton />

            {/* user form */}
            <UserForm />
        </ >
    );
};

export default ProfilePage;