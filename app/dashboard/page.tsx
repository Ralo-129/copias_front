'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, FileText, Users } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { SolicitudesView } from "./SolicitudesView";
import { ProfesoresView } from "./ProfesoresView";
import type { Impresion, Usuario } from "./helpers";

function BrandMark({ className}: { className?: string}) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
            <rect x="6.5" y="1" width="10" height="13" rx="2" fill="currentColor" fillOpacity="0.28" />
            <rect x="3" y="4" width="10" height="13" rx="2" fill="currentColor" />
            <path d="M5.5 7.5h5M5.5 10.5h3.5M5.5 13h4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
        </svg>
    );    
}

export default function Dashboard() {
    const router = useRouter();
    const [tab, setTab] = useState<'solicitudes' | 'profesores'>('solicitudes');
    const [impresiones, setImpresiones] = useState<Impresion[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    function cargarImpresiones() {
        fetch(process.env.NEXT_PUBLIC_API_URL + '/impresiones')
          .then(res => res.json())
          .then(data => setImpresiones(data));
    }

    function cargarUsuarios() {
        fetch(process.env.NEXT_PUBLIC_API_URL + '/usuarios')
          .then(res => res.json())
          .then(data => setUsuarios(data));
    }

    useEffect(() => {
        const rol = localStorage.getItem('rol');
        if (rol !== 'admin') {
            router.push('/login');
            return;
        }
        cargarImpresiones();
        cargarUsuarios();
    }, []);

    function handleLogout() {
        localStorage.clear();
        router.push('/login');
    }

    async function handleToggleCompletado(id: string) {
        await fetch(process.env.NEXT_PUBLIC_API_URL + '/impresiones/' + id + '/toggle-completado', {
            method: 'POST',
        });
        cargarImpresiones();
    }

    async function handleCrearProfesor(data: { usuario: string; password: string; nombre: string; grado: string; seccion: string }) {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await res.json();

        if (result.ok) {
            cargarUsuarios();
            return true;
        }
        return false;
    }

    async function handleToggleActivo(id: string) {
        await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/usuarios/' + id + '/toggle-activo', {
            method: 'POST',
        });
        cargarUsuarios();
    }

    async function handleEditar(id: string, grado: string, seccion: string) {
        await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/usuarios/' + id + '/editar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grado, seccion }),
        });
        cargarUsuarios();
    }
    
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BrandMark className="w-5 h-5 text-primary" />
                        <span className="text-foreground font-semibold tracking-tight">CopiaFácil</span>
                        <span className="text-muted-foreground text-sm hidden sm:inline">· Panel de administración</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground hidden sm:block">Administrador</span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <LogOut className="size-4" />
                            Salir
                        </button>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 border-t border-border">
                    <button
                        type="button"
                        onClick={() => setTab('solicitudes')}
                        className={cn(
                            'flex items-center gap-2 px-3 py-3 text-sm border-b-2 transition-colors',
                            tab === 'solicitudes' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <FileText className="size-4" />
                        Solicitudes
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('profesores')}
                        className={cn(
                            'flex items-center gap-2 px-3 py-3 text-sm border-b-2 transition-colors',
                            tab === 'profesores' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <Users className="size-4" />
                        Profesores
                    </button>
                </div>
            </header>

            <main className="flex-1 px-4 sm:px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    {tab === 'solicitudes' && (
                        <SolicitudesView impresiones={impresiones} onToggleCompletado={handleToggleCompletado} />
                    )}
                    {tab === 'profesores' && (
                        <ProfesoresView
                            usuarios={usuarios}
                            onCrear={handleCrearProfesor}
                            onToggleActivo={handleToggleActivo}
                            onEditar={handleEditar}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}