'use client'

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle2, X, GraduationCap, FilePlus } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { formatFileSize } from "./helpers";

export function UploadForm({ grado, seccion, onEnviado }: { grado: string; seccion: string; onEnviado: () => void }) {
    const [descripcion, setDescripcion] = useState('');
    const [archivo, setArchivo] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileSelect(f: File | null) {
        if (f) setArchivo(f);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) handleFileSelect(dropped);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!archivo) return;

        setLoading(true);
        setError('');

        const nombreProfesor = localStorage.getItem('nombre') ?? 'Desconocido';

        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('grado', grado);
        formData.append('seccion', seccion);
        formData.append('descripcion', descripcion);
        formData.append('profesor', nombreProfesor);

        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/subir', {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();

        setLoading(false);

        if (data.ok) {
            setEnviado(true);
            onEnviado();
        } else {
            setError(data.mensaje ?? 'Ocurrió un error al enviar la solicitud');
        }
    }

    if (enviado) {
        return (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
                <div className="bg-card border border-border rounded-3xl p-10 shadow-sm text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="size-10 text-green-600" />
                    </motion.div>
                    <h2 className="text-2xl font-semibold text-foreground">¡Solicitud enviada!</h2>
                    <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto leading-relaxed">
                        Tu archivo fue enviado correctamente y ya se encuentra en la cola de impresión.
                    </p>
                    <div className="mt-6 max-w-md mx-auto rounded-2xl bg-muted/60 p-4 text-left flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="size-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{archivo?.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Solicitud registrada</p>
                        </div>
                        <CheckCircle2 className="size-5 text-green-600 shrink-0" />
                    </div>
                    <Button
                        onClick={() => {
                            setDescripcion('');
                            setArchivo(null);
                            setEnviado(false);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        size="lg"
                        className="mt-8"
                    >
                        <FilePlus className="size-4 mr-2" />
                        Nueva solicitud
                    </Button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
            <div className="mb-7">
                <p className="text-primary text-xs font-semibold uppercase tracking-[0.14em] mb-1.5">Panel docente</p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">Nueva solicitud</h1>
                <p className="text-muted-foreground text-sm mt-2">Envía un archivo para imprimir o fotocopiar.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <Label>Sección</Label>
                    <div className="mt-2 flex items-center gap-3 rounded-2xl bg-muted/60 border border-border px-4 py-3.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="size-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{grado}° {seccion}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Sección asignada a tu perfil</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="descripcion">Instrucciones</Label>
                        <span className="text-xs font-medium text-primary">Obligatorio</span>
                    </div>
                    <Textarea
                        id="descripcion"
                        placeholder="Ej. 15 copias, doble cara, engrapado..."
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows={4}
                        className="mt-2 flex items-center gap-3 rounded-2xl bg-muted/60 border border-border px-4 py-3.5"
                    />
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <Label>Archivo</Label>
                            <p className="text-xs text-muted-foreground mt-1">PDF, Word, Excel, PowerPoint o imagen.</p>
                        </div>
                        <span className="text-xs font-medium text-primary">Obligatorio</span>
                    </div>

                    {archivo ? (
                        <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <FileText className="size-6 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">{archivo.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{formatFileSize(archivo.size)}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setArchivo(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            animate={{ scale: dragging ? 1.01 : 1 }}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setDragging(false); }}
                            onDrop={handleDrop}
                            className={cn(
                                'cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all',
                                dragging ? 'border-primary bg-primary/[0.07]' : 'border-border hover:border-primary/40 hover:bg-muted/30'
                            )}
                        >
                            <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5', dragging ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary')}>
                                <Upload className="size-7" />
                            </div>
                            <h3 className="font-semibold">{dragging ? 'Suelta tu archivo aquí' : 'Arrastra tu archivo aquí'}</h3>
                            <p className="text-sm text-muted-foreground mt-2">o <span className="text-primary font-medium">haz clic para buscarlo</span></p>
                            <div className="flex flex-wrap justify-center gap-2 mt-5">
                                {['PDF', 'Word', 'Excel', 'PowerPoint', 'Imágenes'].map((format) => (
                                    <span key={format} className="px-2.5 py-1 rounded-lg bg-background border border-border text-[11px] text-muted-foreground">{format}</span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    />
                </div>

                {error && (
                    <div className="mx-6 mb-4 bg-destructive/8 border border-destructive/20 rounded-xl px-3.5 py-3">
                        <p className="text-destructive text-sm leading-snug">{error}</p>
                    </div>
                )}

                <div className="p-6 pt-0">
                    <Button type="submit" size="lg" disabled={!archivo || !descripcion.trim() || loading} className="w-full h-12 rounded-2xl">
                        {loading ? 'Enviando solicitud...' : <><Upload className="size-4 mr-2" />Enviar solicitud</>}
                    </Button>
                    {(!archivo || !descripcion.trim()) && (
                        <p className="text-xs text-center text-muted-foreground mt-3">
                            {!archivo ? 'Selecciona un archivo para continuar.' : 'Escribe las instrucciones de impresión.'}
                        </p>
                    )}
                </div>
            </form>
        </motion.div>
    );
}