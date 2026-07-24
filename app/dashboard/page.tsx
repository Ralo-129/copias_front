'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const [impresiones, setImpresiones] = useState<any[]>([]);

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

    return (
        <main>
            <h1>Dashboard</h1>
            <ul>
                {impresiones.map((item, index) => (
                    <li key={index}>
                        {item.profesor} - {item.seccion} - {item.hora} - {item.descripcion}
                    </li>
                ))}
            </ul>
        </main>
    )
}