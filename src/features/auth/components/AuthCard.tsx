import type { ReactNode } from "react";
import { Link } from "react-router";
import heroImage from "@/assets/hero.svg";
import { useAppStore } from "@/stores/app.store";
import { FaGithub, FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa";
import { useRef } from "react";
import { useClickAway } from "react-use";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AuthCardProps {
    title: string;
    descTo: string;
    children: ReactNode;
    to: string;
    descLink: string;
    descFor?: string;
}

export const AuthCard = ({
    title,
    descTo,
    to,
    descLink,
    children,
    descFor
}: AuthCardProps) => {

    const { isOpenToggleForm, toggleForm, closeToggleForm } = useAppStore();
    const sheetRef = useRef<HTMLDivElement>(null);
    const toggleBtnRef = useRef<HTMLButtonElement>(null);

    useClickAway(sheetRef, (e) => {
        if (toggleBtnRef.current?.contains(e.target as Node)) return;
        if (isOpenToggleForm) closeToggleForm();
    });

    return (
        <div
            className="
                relative
                w-full
                max-w-full
                min-w-0
                min-h-0
                overflow-x-hidden
                2xl:overflow-x-visible
                h-full
                flex
                flex-col
                justify-between
                gap-6
                px-0
                lg:flex-row-reverse
                lg:items-center
                lg:justify-center
                lg:h-screen
                lg:max-w-7xl
                lg:mx-auto
                2xl:max-w-full
                2xl:gap-10
            "
        >

            {/* hero image area */}
            <div
                className="
                    w-full
                    min-w-0
                    max-w-full
                    h-full
                    flex
                    items-center
                    justify-center
                    lg:w-[45%]
                    lg:h-full
                    lg:items-start
                    lg:pb-12
                    2xl:w-[42%]
                    2xl:pb-16
                "
            >
                <img
                    src={heroImage}
                    alt="contact-management"
                    className="
                        w-full
                        max-w-full
                        h-auto
                        shadow-sm
                        object-contain
                        sm:max-w-sm
                        md:max-w-full
                        md:w-full
                        md:h-[70vh]
                        lg:h-full
                        lg:object-cover
                        md:object-cover
                        md:object-top
                        mx-auto
                        rounded-b-3xl
                        md:rounded-b-4xl
                        sm:rounded-none
                        lg:rounded-b-[48px]
                        lg:rounded-br-none
                        transition-[filter]
                        duration-300
                        dark:brightness-[0.6]
                        dark:saturate-[0.8]
                    "
                />
            </div>

            {/* title area — px-4 aman untuk 320px; sm+ sedikit longgar */}
            <div className="w-full min-w-0 max-w-full px-4 sm:px-6 lg:px-0 lg:pr-0 lg:pl-12 2xl:pl-32 2xl:pr-4 pb-20 text-center flex-1 flex justify-center items-center lg:items-start lg:text-left flex-col lg:pb-0">

                <h1 className="
                        w-full
                        min-w-0
                        text-2xl
                        md:text-4xl
                        lg:text-5xl
                        2xl:text-6xl
                        font-black
                        md:border-b
                        md:pb-2
                        uppercase
                        text-foreground
                        mb-2
                        lg:border-none
                        lg:pb-0
                        text-balance
                        wrap-break-word
                    "
                >
                    Contact Management
                </h1>
                <p className="w-full min-w-0 max-w-md 2xl:max-w-2xl mx-auto lg:mx-0 mb-6 text-center text-sm md:text-base lg:text-left lg:text-lg lg:opacity-80 2xl:text-xl 2xl:leading-relaxed text-muted-foreground wrap-break-word">
                    Kelola kontak Anda dengan mudah dan efisien. Simpan, edit, dan akses informasi kontak kapan saja, di mana saja.
                </p>

                {/* Desktop Get Started Button */}
                <Button
                    ref={toggleBtnRef}
                    onClick={() => toggleForm()}
                    size="lg"
                    variant={"secondary"}
                    className="hidden px-6 py-6 lg:flex rounded-3xl font-bold text-lg 2xl:text-xl 2xl:px-10 2xl:py-7 hover:scale-105 transition-transform cursor-pointer mb-2 shadow-lg"
                >
                    Mulai Sekarang
                </Button>

                <div className="lg:mt-4 2xl:mt-6">

                    <h3 className="text-sm 2xl:text-base text-muted-foreground opacity-50">Crafted by <span className="font-bold">Malfin</span></h3>

                    <div className="flex items-center gap-2 2xl:gap-3 justify-center lg:justify-start mt-2">

                        <Link to="https://github.com/malllvinnn" className="hover:scale-105 transition-transform">
                            <FaGithub className="text-2xl md:text-3xl 2xl:text-4xl" />
                        </Link>
                        <Link to="https://www.linkedin.com/in/muhammad-malfin-8642241b8/" className="hover:scale-105 transition-transform">
                            <FaLinkedin className="text-2xl md:text-3xl 2xl:text-4xl" />
                        </Link>
                        <Link to="https://www.instagram.com/malllvinnn/" className="hover:scale-105 transition-transform">
                            <FaInstagram className="text-2xl md:text-3xl 2xl:text-4xl" />
                        </Link>
                        <Link to="https://www.tiktok.com/@malllvinnn" className="hover:scale-105 transition-transform">
                            <FaTiktok className="text-2xl md:text-3xl 2xl:text-4xl" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* form content area - Bottom Sheet (Mobile) / Side Drawer (Desktop) */}
            <div
                ref={sheetRef}
                className={`
                    fixed z-50 min-w-0 max-w-full transition-transform duration-500 ease-in-out
                    /* Mobile: Bottom Sheet */
                    bottom-0 left-0 right-0 w-full
                    ${isOpenToggleForm ? "translate-y-0" : "translate-y-[calc(100%-52px)]"}
                    /* Desktop: Side Drawer */
                    lg:top-0 lg:right-0 lg:bottom-0 lg:left-auto
                    lg:w-[min(100%,450px)] lg:max-w-[450px] 2xl:w-[min(100%,520px)] 2xl:max-w-[520px] lg:h-full
                    lg:translate-y-0
                    ${isOpenToggleForm ? "lg:translate-x-0" : "lg:translate-x-full"}
                `}
            >

                {/* handle bar / toggle button (Only Mobile) */}
                <button
                    onClick={() => toggleForm()}
                    className="w-full flex items-center justify-center px-4 py-3 bg-card/50 backdrop-blur-lg border-t border-border rounded-t-2xl cursor-pointer group lg:hidden"
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className={`h-1 rounded-full bg-border transition-all duration-500 ${isOpenToggleForm ? "w-14" : "w-10"}`} />
                        {!isOpenToggleForm && (
                            <span className="max-w-[min(100%,20rem)] text-center text-[10px] uppercase tracking-widest text-muted-foreground font-bold wrap-break-word px-1">
                                Klik Sini untuk {title.toUpperCase()}
                            </span>
                        )}
                    </div>
                </button>

                {/* form content */}
                <div className="bg-card/50 backdrop-blur-lg px-4 pt-2 flex flex-col gap-4 h-full min-w-0 max-w-full overflow-x-hidden pb-[max(2rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-12 2xl:px-10 2xl:pt-16 2xl:gap-6 lg:justify-center lg:border-l lg:border-border">

                    <div className="flex min-w-0 justify-between items-start gap-2 mb-4 lg:mb-8 2xl:mb-10">

                        <h1 className="min-w-0 flex-1 text-2xl font-bold md:text-3xl 2xl:text-4xl text-foreground wrap-break-word">{title}</h1>

                        {/* Close button for Side Drawer */}
                        <Button
                            onClick={() => closeToggleForm()}
                            className="hidden lg:flex bg-transparent hover:bg-foreground/10 transition-colors cursor-pointer text-foreground/50 border-foreground/10"
                        >
                            <X />
                        </Button>
                    </div>

                    {descFor && (
                        <p className="text-sm md:text-base 2xl:text-lg text-muted-foreground">
                            {descFor}
                        </p>
                    )}

                    {children}

                    <p className="min-w-0 text-sm md:text-base 2xl:text-lg text-muted-foreground wrap-break-word">

                        <span className="opacity-50">{descTo}{" "}</span>

                        <Link to={to} className="font-medium text-foreground underline underline-offset-4 wrap-break-word">
                            {descLink}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
