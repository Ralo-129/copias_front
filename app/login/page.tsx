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
            localStorage.setItem('nombre', data.nombre);
            localStorage.setItem('grado', data.grado ?? '');
            localStorage.setItem('seccion', data.seccion ?? '');

            if (data.rol === 'admin') {
                router.push('/dashboard');
            } else if (data.rol === 'profesor') {
                router.push('/subir');
            } else {
                setResultado('Rol no reconocido');
            }
        } else {
            setResultado(data.mensaje ?? 'Usuario o contraseña incorrectos');
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white text-2xl">🖨️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CopiaFácil</h1>
            <p className="text-gray-500 mb-6">Gestión de impresiones escolares</p>

            <div className="w-full max-w-sm bg-white rounded-xl shadow-sm p-6">
                
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <input
                    className="w-full bg-gray-100 rounded-lg px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu nombre de usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                    className="w-full bg-gray-100 rounded-lg px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
                >
                    Ingresar
                </button>

                {resultado && (
                    <p className="text-sm text-red-600 mt-3 text-center">{resultado}</p>
                )}
            </div>
        </main>
    );
}