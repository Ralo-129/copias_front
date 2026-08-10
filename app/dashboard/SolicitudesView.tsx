'use client'

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { Clock, Check, Download } from "lucide-react";
import { fmtTimestamp, type Impresion } from "./helpers";

type EstadoFiltro = 'todas' | 'pendientes' | 'completadas';

export function SolicitudesView ({
    impresiones,
    onToggleCompletado,
}: {
    impresiones: Impresion[];
    onToggleCompletado: (id: string) => void;
}) {
    const [filtroEstado, setFiltroEstado] = useState<EstadoFiltro>('todas');
    const [filtroSeccion, setFiltroSeccion] = useState('todas');

    const secciones = useMemo(
        () => Array.from(new Set(impresiones.map((item) => `${item.grado}° ${item.seccion}`))),
        [impresiones]
    );

    const pendientes = impresiones.filter((i) => !i.completado).length;
    const completadas = impresiones.filter((i) => i.completado).length;

    const filtradas = useMemo(() => {
        return impresiones
            .filter((item) => {
                if (filtroEstado === 'pendientes' && item.completado) return false;
                if (filtroEstado === 'completadas' && !item.completado) return false;
                if (filtroSeccion !== 'todas' && `${item.grado}° ${item.seccion}` !== filtroSeccion) return false;
                return true;
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [impresiones, filtroEstado, filtroSeccion]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Pendientes</p>
                    <p className="text-2xl font-semibold mt-1">{pendientes}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Completadas</p>
                    <p className="text-2xl font-semibold mt-1">{completadas}</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
                    <p className="text-2xl font-semibold mt-1">{impresiones.length}</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold">Solicitudes</p>
                    <div className="flex gap-1 bg-muted rounded-xl p-1">
                        {(['todas', 'pendientes', 'completadas'] as EstadoFiltro[]).map((estado) => (
                            <button
                                key={estado}
                                type="button"
                                onClick={() => setFiltroEstado(estado)}
                                className={cn(
                                    'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize',
                                    filtroEstado === estado ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {estado}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-5 sm:px-6 py-3 border-b border-border flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setFiltroSeccion('todas')}
                        className={cn(
                            'px-3 py-1 text-xs rounded-full border transition-colors',
                            filtroSeccion === 'todas' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                        )}
                    >
                        Todos
                    </button>
                    {secciones.map((sec) => (
                        <button
                            key={sec}
                            type="button"
                            onClick={() => setFiltroSeccion(sec)}
                            className={cn(
                                'px-3 py-1 text-xs rounded-full border transition-colors',
                                filtroSeccion === sec ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'
                            )}
                        >
                            {sec}
                        </button>
                    ))}
                </div>
                <div className="divide-y divide-border">
                    {filtradas.length === 0 ? (
                        <div className="p-14 text-center">
                            <p className="text-sm text-muted-foreground">No hay solicitudes que coincidan con este filtro.</p>
                        </div>
                    ) : (
                        filtradas.map((item) => (
                            <div key={item._id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="text-sm font-semibold">Prof. {item.profesor}</p>
                                        <Badge variant="outline" className="rounded-full text-xs">{item.grado}° {item.seccion}</Badge>
                                        <Badge className={!item.completado ? 'bg-amber-50 text-amber-700 border-amber-200 gap-1 rounded-full' : 'bg-green-50 text-green-700 border-green-200 gap-1 rounded-full'}>
                                            {!item.completado ? <><Clock className="size-3" />Pendiente</> : <><Check className="size-3" />Completado</>}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{item.descripcion}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {fmtTimestamp(new Date(item.createdAt))} · {item.archivo}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Button variant="outline" size="sm" className="rounded-xl" asChild>
                                        <a href={process.env.NEXT_PUBLIC_API_BASE_URL + '/uploads/' + item.archivo}
                                            target="_blank"
                                        >
                                            <Download className="size-4 mr-1.5" />
                                            Descargar
                                        </a>
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="rounded-xl"
                                        variant={item.completado ? 'outline' : 'default'}
                                        onClick={() => onToggleCompletado(item._id)}
                                    >
                                        {item.completado ? 'Reabrir' : 'Listo'}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}