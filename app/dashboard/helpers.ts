export function fmtTimestamp(date: Date) {
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMin < 2) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHr < 24) return `Hace ${diffHr}h`;
    if (diffDays === 1) return `Ayer, ${date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export type Impresion = {
    _id: string;
    profesor: string;
    grado: string;
    seccion: string;
    descripcion: string;
    archivo: string;
    completado: boolean;
    createdAt: string;
};

export type Usuario = {
    _id: string;
    usuario: string;
    nombre: string;
    rol: 'admin' | 'profesor';
    grado: string;
    seccion?: string;
    activo: boolean; 
}