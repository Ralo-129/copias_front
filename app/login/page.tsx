'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [resultado, setResultado] = useState('');
    const router = useRouter();

    async function handleLogin() {
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password }),
        });
        const data = await res.json();

        if (data.ok) {
            localStorage.setItem('rol', data.rol);
            router.push('/dashboard');
        } else {
            setResultado('Usuario o contraseña incorrectos');
        }
    }

    return (
        <main>
            <h1>Iniciar sesion</h1>
            <input 
               placeholder="Usuario"
               value={usuario}
               onChange={(e) => setUsuario(e.target.value)}
            />
            <input 
               placeholder="Contraseña"
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Iniciar sesion</button>
            <p>{resultado}</p>
        </main>
    );
}