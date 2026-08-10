'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, History, FilePlus } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { UploadForm } from "./UploadForm";
import { HistoryView } from "./HistoryView";
import type { Impresion } from "./helpers";

function BrandMark({ className }: {  className?: string}) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
            <rect x="6.5" y="1" width="10" height="13" rx="2" fill="currentColor" fillOpacity="0.28" />
            <rect x="3" y="4" width="10" height="13" rx="2" fill="currentColor" />
            <path d="M5.5 7.5h5M5.5 10.5h3.5M5.5 13h4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.8" />
        </svg>
    );   
}

export default function Subir() {
    const router = useRouter();
    const [grado, setGrado] = useState('');
    const [seccion, setSeccion] = useState('');
    const [nombre, setNombre] = useState('');
    const [tab, setTab] = useState<'form' | 'history'>('form');
    const [impresiones, setImpresiones] = useState<Impresion[]>([]);

    function cargarMisImpresiones(nombreProfesor: string) {
        fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/impresiones')
        .then(res => res.json())
        .then((data: Impresion[]) => {
            setImpresiones(data.filter((item) => item.profesor === nombreProfesor));
        });
    }

    useEffect(() => {
        const rol = localStorage.getItem('rol');
        if (rol !== 'profesor') {
            router.push('/login');
            return;
        }
        const n = localStorage.getItem('nombre') ?? '';
        setGrado(localStorage.getItem('grado') ?? '');
        setSeccion(localStorage.getItem('seccion') ?? '');
        setNombre(n);
        cargarMisImpresiones(n);
    }, []);

    function handleLogout() {
        localStorage.clear();
        router.push('/login');
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BrandMark className="w-5 h-5 text-primary" />
                        <span className="text-foreground font-semibold tracking-tight">CopiaFácil</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground hidden sm:block">{nombre}</span>
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
                        onClick={() => setTab('form')}
                        className={cn(
                            'flex items-center gap-2 px-3 py-3 text-sm border-b-2 transition-colors',
                            tab === 'form' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <FilePlus className="size-4" />
                        Nueva solicitud
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('history')}
                        className={cn(
                            'flex items-center gap-2 px-3 py-3 text-sm border-b-2 transition-colors',
                            tab === 'history' ? 'border-primary text-primary font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <History className="size-4" />
                        Historial
                    </button>
                </div>
            </header>

            <main className="flex-1 px-4 sm:px-6 py-8">
                <div className="max-w-6xl mx-auto flex justify-center">
                    {tab === 'form' && (
                        <UploadForm
                            grado={grado}
                            seccion={seccion}
                            onEnviado={() => cargarMisImpresiones(nombre)}
                        />
                    )}
                    {tab === 'history' && <HistoryView impresiones={impresiones} />}
                </div>
            </main>
        </div>
    );
}