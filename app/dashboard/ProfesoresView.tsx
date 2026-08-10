'use client'

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { Plus, Pencil, X } from "lucide-react";
import type { Usuario } from "./helpers";

type FiltroActivo = 'todas' | 'habilitadas' | 'deshabilitadas';

export function ProfesoresView({
    usuarios,
    onCrear,
    onToggleActivo,
    onEditar,
}: {
    usuarios: Usuario[];
    onCrear: (data: { usuario: string; password: string; nombre: string; grado: string; seccion: string }) => Promise<boolean>;
    onToggleActivo: (id: string) => void;
    onEditar: (id: string, grado: string, seccion: string) => void;
}) {
    const [filtro, setFiltro] = useState<FiltroActivo>('todas');
    const [mostrarForm, setMostrarForm] = useState(false);

    const profesores = useMemo(() => usuarios.filter((u) => u.rol === 'profesor'), [usuarios]);

    const filtrados = useMemo(() => {
        if (filtro === 'habilitadas') return profesores.filter((p) => p.activo);
        if (filtro === 'deshabilitadas') return profesores.filter((p) => !p.activo);
        return profesores;
    }, [profesores, filtro]);

    const activos = profesores.filter((p) => p.activo).length;
    const inactivos = profesores.filter((p) => !p.activo).length;

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [grado, setGrado] = useState('');
    const [seccion, setSeccion] = useState('');
    const [errorForm, setErrorForm] = useState('');
    const [creando, setCreando] = useState(false);

    async function handleCrear(e: React.FormEvent) {
        e.preventDefault();
        setErrorForm('');
        setCreando(true);

        const ok = await onCrear({
            usuario: usuario.trim(),
            password,
            nombre: nombre.trim(),
            grado: grado.trim(),
            seccion: seccion.trim(),
        })

        setCreando(false);
        if (ok) {
            setUsuario('');
            setPassword('');
            setNombre('');
            setGrado('');
            setSeccion('');
            setMostrarForm(false);
        } else {
            setErrorForm('No se puede crear el profesor. Verifica los datos.')
        }
    }

    return (
        <div className="w-full">
            <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold">Profesores</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activos} activos · {inactivos} deshabilitados</p>
                    </div>
                    <Button size="sm" className="rounded-xl" onClick={() => setMostrarForm((v) => !v)}>
                        {mostrarForm ? <><X className="size-4 mr-1.5" />Cancelar</> : <><Plus className="size-4 mr-1.5" />Crear profesor</>}
                    </Button>
                </div>
                
                {mostrarForm && (
                    <form onSubmit={handleCrear} className="px-5 sm:px-6 py-5 border-b border-border bg-muted/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="p-usuario">Usuario o correo</Label>
                            <Input id="p-usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="p-password">Contraseña</Label>
                            <Input id="p-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="p-nombre">Nombre completo</Label>
                            <Input id="p-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="p-grado">Grado</Label>
                                <Input id="p-grado" placeholder="1" value={grado} onChange={(e) => setGrado(e.target.value)} required />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="p-seccion">Sección</Label>
                                <Input id="p-seccion" placeholder="A" value={seccion} onChange={(e) => setSeccion(e.target.value)} required />
                            </div>
                        </div>

                        {errorForm && (
                            <div className="sm:col-span-2 bg-destructive/8 border border-destructive/20 rounded-xl px-3.5 py-3">
                                <p className="text-destructive text-sm">{errorForm}</p>
                            </div>
                        )}

                        <div className="sm:col-span-2">
                            <Button type="submit" className="rounded-xl" disabled={creando}>
                                {creando ? 'Creando...' : 'Guardar profesor'}
                            </Button>
                        </div>
                    </form>
                )}

                <div className="px-5 sm:px-6 py-3 border-b border-border flex gap-1 bg-muted/30">
                    {(['todas', 'habilitadas', 'deshabilitadas'] as FiltroActivo[]).map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFiltro(f)}
                            className={cn(
                                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize',
                                filtro === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="divide-y divide-border">
                    {filtrados.length === 0 ? (
                        <div className="p-14 text-center">
                            <p className="text-sm text-muted-foreground">No hay profesores en este filtro.</p>
                        </div>
                    ) : (
                        filtrados.map((p) => (
                            <ProfesorRow key={p._id} profesor={p} onToggleActivo={onToggleActivo} onEditar={onEditar} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function ProfesorRow({
    profesor,
    onToggleActivo,
    onEditar,
}: {
    profesor: Usuario;
    onToggleActivo: (id: string) => void;
    onEditar: (id: string, grado: string, seccion: string) => void;
}) {
    const [editando, setEditando] = useState(false);
    const [editGrado, setEditGrado] = useState(profesor.grado ?? '');
    const [editSeccion, setEditSeccion] = useState(profesor.seccion ?? '');

    function guardar() {
        onEditar(profesor._id, editGrado.trim(), editSeccion.trim());
        setEditando(false);
    }

    return (
        <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">Prof. {profesor.nombre}</p>
                        <Badge className={profesor.activo ? 'bg-green-50 text-green-700 border-green-200 rounded-full' : 'bg-muted text-muted-foreground border-border rounded-full'}>
                            {profesor.activo ? 'Activo' : 'Deshabilitado'}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        @{profesor.usuario} · {profesor.grado ?? '-'}° {profesor.seccion ?? '-'}
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant={profesor.activo ? 'outline' : 'default'}
                        size="sm"
                        className="rounded-xl"
                        onClick={() => onToggleActivo(profesor._id)}
                    >
                        {profesor.activo ? 'Deshabilitar' : 'Habilitar'}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setEditando((v) => !v)}>
                        <Pencil className="size-3.5 mr-1.5" />
                        Editar
                    </Button>
                </div>
            </div>

            {editando && (
                <div className="mt-4 flex flex-wrap items-end gap-3 bg-muted/40 rounded-2xl p-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`grado-${profesor._id}`} className="text-xs">Grado</Label>
                        <Input
                            id={`grado-${profesor._id}`}
                            value={editGrado}
                            onChange={(e) => setEditGrado(e.target.value)}
                            className="w-20 h-9"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor={`seccion-${profesor._id}`} className="text-xs">Sección</Label>
                        <Input
                            id={`seccion-${profesor._id}`}
                            value={editSeccion}
                            onChange={(e) => setEditSeccion(e.target.value)}
                            className="w-20 h-9"
                        />
                    </div>
                    <Button size="sm" className="rounded-xl" onClick={guardar}>Guardar</Button>
                    <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => setEditando(false)}>Cancelar</Button>
                </div>
            )}
        </div>
    );
}