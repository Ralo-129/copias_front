'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Subir() {
    const router = useRouter();
    const [seccion, setSeccion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [archivo, setArchivo] = useState<File | null>(null);
    const [resultado, setResultado] = useState('');

    useEffect(() => {
        const rol = localStorage.getItem('rol');
        if (rol !== 'profesor') {
            router.push('/login');
            return;
        }
    }, []);

    async function handleSubir() {
        if (!archivo) {
            setResultado('Selecciona un archivo primero');
            return;
        }

        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('seccion', seccion);
        formData.append('descripcion', descripcion);

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
            <input
                placeholder= "Seccion (ej: 1A)"
                value={seccion}
                onChange={(e) => setSeccion(e.target.value)}
            />
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