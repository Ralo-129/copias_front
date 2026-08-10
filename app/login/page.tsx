'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MailCheck } from "lucide-react";
import { cn } from "@/components/ui/utils";

type LoginView = 'login' | 'forgot-step1' | 'forgot-step2';

function BrandMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
            <rect x="6.5" y="1" width="10" height="13" rx="2" fill="currentColor" fillOpacity="0.28" />
            <rect x="3" y="4" width="10" height="13" rx="2" fill="currentColor" />
            <path
                d="M5.5 7.5h5M5.5 10.5h3.5M5.5 13h4.5"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeOpacity="0.8"
            />
        </svg>
    );
}

export default function LoginPage() {
    const [view, setView] = useState<LoginView>('login');

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-[360px]">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-md">
                        <BrandMark className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-foreground text-center tracking-tight text-2xl font-bold">CopiaFácil</h1>
                    <p className="text-muted-foreground text-center mt-1 text-sm">
                        Gestión de impresiones escolares
                    </p>
                </div>

                {view === 'login' && <LoginForm onForgot={() => setView('forgot-step1')} />}
                {view === 'forgot-step1' && <ForgotStep1 onBack={() => setView('login')} onSent={() => setView('forgot-step2')} />}
                {view === 'forgot-step2' && <ForgotStep2 onBack={() => setView('login')} />}
            </div>
        </div>
    );
}

function LoginForm({ onForgot }: { onForgot: () => void }) {
    const router = useRouter();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuario.trim(), password }),
        });
        const data = await res.json();

        setLoading(false);

        if (data.ok) {
            localStorage.setItem('rol', data.rol);
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('grado', data.grado ?? '');
            localStorage.setItem('seccion', data.seccion ?? '');

            if (data.rol === 'admin') {
                router.push('/dashboard');
            } else if (data.rol === 'profesor') {
                router.push('/subir');
            } else {
                setError('Rol no reconocido');
            }
        } else {
            setError(data.mensaje ?? 'Usuario o contraseña incorrectos');
        }
    }

    return (
        <>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="usuario">Usuario</Label>
                        <Input
                            id="usuario"
                            placeholder="Tu nombre de usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            autoComplete="username"
                            autoFocus
                            required
                            className="border-2 border-gray-300 bg-white rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                            className="border-2 border-gray-300 bg-white rounded-lg"
                        />
                    </div>

                    {error && (
                        <div className="bg-destructive/8 border border-destructive/20 rounded-xl px-3.5 py-3">
                            <p className="text-destructive text-sm leading-snug">{error}</p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onForgot}
                        className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors underline-offset-2"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>

                    <Button type="submit" size="lg" className="w-full mt-1 font-medium" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </Button>
                    
                </form>
            </div>
        </>
    );
}

function ForgotStep1({ onBack, onSent }: { onBack: () => void; onSent: () => void }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 700));
        setLoading(false);
        onSent();
    }

    return (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="mb-5">
                <h2 className="text-foreground tracking-tight text-lg font-semibold">Recuperar contraseña</h2>
                <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                    Ingresá tu correo y te enviamos un enlace para restablecer tu contraseña.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="forgot-email">Correo electrónico</Label>
                    <Input
                        id="forgot-email"
                        type="email"
                        placeholder="tucorreo@colegio.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        required
                    />
                </div>

                <Button type="submit" size="lg" className="w-full font-medium" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar enlace'}
                </Button>

                <BackLink onClick={onBack} />
            </form>
        </div>
    );
}

function ForgotStep2({ onBack }: { onBack: () => void }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MailCheck className="size-7 text-green-600" />
            </div>
            <h2 className="text-foreground tracking-tight mb-2 text-lg font-semibold">Revisá tu correo</h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña. Revisá también spam.
            </p>
            <BackLink onClick={onBack} className="justify-center" />
        </div>
    );
}

function BackLink({ onClick, className }: { onClick: () => void; className?: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors',
                className
            )}
        >
            <ArrowLeft className="size-3.5" />
            Volver a iniciar sesión
        </button>
    );
}