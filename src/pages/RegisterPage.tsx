import { AuthCard } from "@/features/auth/components/AuthCard";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

const RegisterPage = () => {
    return (
        <>
            <AuthCard
                title="Register"
                descTo="Sudah punya akun?. Silahkan "
                to="/auth/login"
                descLink="Login"
            >
                <RegisterForm />
            </AuthCard>
        </>
    );
};

export default RegisterPage;