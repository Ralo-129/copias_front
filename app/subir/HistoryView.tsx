'use client'

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    History, Clock, Check, CheckCircle2, InboxIcon, Search, Eye,
    FileText, FileSpreadsheet, FileImage, FileType2, Presentation,
} from "lucide-react";
import { getExtension, getFileTypeLabel, fmtTimestamp, type Impresion } from "./helpers";

function FileTypeIcon({ extension }: { extension: string }) {
    if (['xlsx', 'xls', 'csv'].includes(extension)) return <FileSpreadsheet className="size-6 text-green-600" />;
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) return <FileImage className="size-6 text-sky-600" />;
    if (['ppt', 'pptx'].includes(extension)) return <Presentation className="size-6 text-orange-600" />;
    return <FileType2 className="size-6 text-primary" />;
}

export function HistoryView({ impresiones }: { impresiones: Impresion[] }) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        return[...impresiones]
            .filter((item) => {
                if (!query) return true;
                return `${item.archivo} ${item.descripcion}`.toLowerCase().includes(query);
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [impresiones, search]);

    const pending = impresiones.filter((r) => !r.completado).length;
    const completed = impresiones.filter((r) => r.completado).length;
    
    return (
        <div className="w-full max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <History className="size-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Historial</h1>
                    <p className="text-sm text-muted-foreground mt-1">Consulta tus solicitudes de impresión.</p>
                </div>
            </div>

            <div className="relative mt-5 mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar archivo..." className="pl-9 h-10 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total de solicitudes" value={impresiones.length} icon={<FileText className="size-5 text-primary" />} />
                <StatCard label="Pendientes" value={pending} icon={<Clock className="size-5 text-amber-600" />} />
                <StatCard label="Completadas" value={completed} icon={<CheckCircle2 className="size-5 text-green-600" />} />
            </div>

            {filtered.length === 0 ? (
                <div className="bg-card border border-border rounded-3xl p-14 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
                        <InboxIcon className="size-7 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">{impresiones.length === 0 ? 'Todavía no tienes solicitudes' : 'No encontramos resultados'}</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                        {impresiones.length === 0 ? 'Cuando envíes un documento aparecerá aquí.' : 'Prueba con otro término de búsqueda.'}
                    </p>
                </div>
            ) : (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-5 sm:px-6 py-4 border-b border-border">
                        <p className="text-sm font-semibold">Solicitudes</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</p>
                    </div>
                    <div className="divide-y divide-border">
                        {filtered.map((item) => (
                            <HistoryItem key={item._id} item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-2xl font-semibold mt-1">{value}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center shrink-0">{icon}</div>
            </div>
        </div>
    )
}

function HistoryItem({ item }: { item: Impresion }) {
    const isPending = !item.completado;
    const ext = getExtension(item.archivo);

    return (
        <a href={process.env.NEXT_PUBLIC_API_URL + '/uploads/' + item.archivo}
            target="_blank"
            className="w-full text-left p-5 sm:p-6 hover:bg-muted/30 transition-colors group flex items-center gap-4"
        >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileTypeIcon extension={ext} />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm sm:text-base font-semibold truncate">{item.archivo}</p>
                    <Badge className={isPending ? 'bg-amber-50 text-amber-700 border-amber-200 gap-1 rounded-full' : 'bg-green-50 text-green-700 border-green-200 gap-1 rounded-full'}>
                        {isPending ? <><Clock className="size-3" />Pendiente</> : <><Check className="size-3" />Completado</>}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{getFileTypeLabel(ext)} · {fmtTimestamp(new Date(item.createdAt))}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{item.descripcion || 'Sin instrucciones adicionales'}</p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                <Eye className="size-4" />
                Ver
            </div>
        </a>
    );
}