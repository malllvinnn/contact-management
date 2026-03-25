import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";

const LoginPage = () => {
    return (
        <>
            <AuthCard
                title="Login"
                descTo="Belum punya akun?. Silahkan "
                to="/auth/register"
                descLink="Register"
            >
                <LoginForm />
            </AuthCard>
        </>
    );
};

export default LoginPage;