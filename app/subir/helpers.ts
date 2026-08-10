export function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;  
}

export function getExtension(fileName: string) {
    return fileName.split('.').pop()?.toLowerCase() ?? '';
}

export function getFileTypeLabel(extension: string) {
    if (['doc', 'docx'].includes(extension)) return 'Word';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'Excel';
    if (['ppt', 'pptx'].includes(extension)) return 'PowerPoint';
    if (extension === 'pdf') return 'PDF';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) return 'Imagen';
    return extension ? extension.toUpperCase() : 'Archivo';
}

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
}