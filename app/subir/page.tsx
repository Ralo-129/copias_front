'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Subir() {
    const router = useRouter();

    const [descripcion, setDescripcion] = useState('');
    const [archivo, setArchivo] = useState<File | null>(null);
    const [resultado, setResultado] = useState('');
    const [grado, setGrado] = useState('');
    const [seccion, setSeccion] = useState('');

    useEffect(() => {
        const rol = localStorage.getItem('rol');
        if (rol !== 'profesor') {
            router.push('/login');
            return;
        }

        setGrado(localStorage.getItem('grado') ?? '');
        setSeccion(localStorage.getItem('seccion') ?? '');
    }, []);

    async function handleSubir() {
        if (!archivo) {
            setResultado('Selecciona un archivo primero');
            return;
        }

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
        setResultado(data.mensaje);
    }

    return (
        <main>
            <h1>Subir archivo para impresion</h1>
            <p>Grado: {grado} - Sección: {seccion}</p>
            <textarea
                placeholder="Descripcion (ej: 10 copias, doble cara)"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />
            <input
                type="file"
                onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
            />
            <button onClick={handleSubir}>Enviar</button>
            <p>{resultado}</p>
        </main>
    )
}