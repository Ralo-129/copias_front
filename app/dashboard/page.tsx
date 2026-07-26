'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [impresiones, setImpresiones] = useState<any[]>([]);
    const [filtroSeccion, setFiltroSeccion] = useState('todas');

    useEffect(() => {
        const rol = localStorage.getItem('rol');
        if (rol !== 'admin') {
            router.push('/login');
            return;
        }

        fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/impresiones')
            .then(res => res.json())
            .then(data => setImpresiones(data));
    }, []);

    const secciones = Array.from(
        new Set(impresiones.map((item) => `${item.grado}${item.seccion}`))
    );

    const impresionesFiltradas = 
        filtroSeccion === 'todas'
            ? impresiones
            : impresiones.filter((item) => `${item.grado}${item.seccion}` === filtroSeccion);


    return (
        <main>
            <h1>Dashboard</h1>
            
            <select value={filtroSeccion} onChange={(e) => setFiltroSeccion(e.target.value)}>
                <option value='todas'>Todas las secciones</option>
                {secciones.map((sec, index) => (
                    <option key={index} value={sec}>{sec}</option>
                ))}
            </select>

            <ul>
                {impresionesFiltradas.map((item, index) => (
                    <li key={index}>
                        {item.profesor} - {item.grado}{item.seccion} - {new Date(item.createdAt).toLocaleString()} - {item.descripcion}
                        {' '}
                        
                        <a href={process.env.NEXT_PUBLIC_API_BASE_URL + '/uploads/' + item.archivo} 
                        target="_blank"
                        >
                            Descargar
                        </a>
                    </li>
                ))}
            </ul>
        </main>
    );
}