import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";

const LoginPage = () => {
    return (
        <>
            <AuthCard
                title="Login"
                descTo="Belum punya akun?. Silahkan "
                descFor="Mohon untuk Sign In untuk melanjutkan."
                to="/auth/register"
                descLink="Sign Up"
            >
                <LoginForm />
            </AuthCard>
        </>
    );
};

export default LoginPage;