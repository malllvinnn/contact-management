import { AuthCard } from "@/features/auth/components/AuthCard";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

const RegisterPage = () => {
    return (
        <>
            <AuthCard
                title="Register"
                descTo="Sudah punya akun?. Silahkan "
            >
                <RegisterForm />
            </AuthCard>
        </>
    );
};

export default RegisterPage;