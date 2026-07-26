'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Usuarios() {
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<any[]>([]);

    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [grado, setGrado] = useState('');
    const [seccion, setSeccion] = useState('');
    const [resultado, setResultado] = useState('');

    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [editGrado, setEditGrado] = useState('');
    const [editSeccion, setEditSeccion] = useState('');

    function cargarUsuarios() {
        fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/usuarios')
            .then(res => res.json())
            .then(data => setUsuarios(data));
    }

    useEffect(() => {
        const rol = localStorage.getItem('rol');
        if (rol !== 'admin') {
            router.push('/login');
            return;
        }

        cargarUsuarios();
    }, []);

    async function handleCrearProfesor() {
        const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario: usuario.trim(),
                password,
                nombre: nombre.trim(),
                rol: 'profesor',
                grado: grado.trim(),
                seccion: seccion.trim(),
            }),
        });
        const data = await res.json();

        if (data.ok) {
            setResultado('Profesor creado correctamente');
            setUsuario('');
            setPassword('');
            setNombre('');
            setGrado('');
            setSeccion('');
            cargarUsuarios();
        } else {
            setResultado('Error al crear el profesor');
        }
    }

    async function handleToggleActivo(id: string) {
        await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/usuarios/' + id + '/toggle-activo', {
            method: 'POST',
        });
        cargarUsuarios();
    }

    function abrirEdicion(item: any) {
        setEditandoId(item._id);
        setEditGrado(item.grado ?? '');
        setEditSeccion(item.seccion ?? '');
    }

    async function guardarEdicion(id: string) {
        await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/usuarios/' + id + '/editar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grado: editGrado.trim(),
                seccion: editSeccion.trim(),
            }),
        });
        setEditandoId(null);
        cargarUsuarios();
    }

    return (
        <main>
            <h1>Usuarios</h1>

            <ul>
                {usuarios.map((item, index) => (
                    <li key={index}>
                        {item.nombre} - {item.usuario} - {item.rol} - Grado: {item.grado ?? '-'} - Sección: {item.seccion ?? '-'} - {item.activo ? 'Activo' : 'Deshabilitado'}

                        {item.rol === 'profesor' && (
                            <>
                                {' '}
                                <button onClick={() => handleToggleActivo(item._id)}>
                                    {item.activo ? 'Deshabilitar' : 'Habilitar'}
                                </button>
                                {' '}
                                <button onClick={() => abrirEdicion(item)}>Editar</button>

                                {editandoId === item._id && (
                                    <div>
                                        <input placeholder="Grado" value={editGrado} onChange={(e) => setEditGrado(e.target.value)} />
                                        <input placeholder="Sección" value={editSeccion} onChange={(e) => setEditSeccion(e.target.value)} />
                                        <button onClick={() => guardarEdicion(item._id)}>Guardar</button>
                                        <button onClick={() => setEditandoId(null)}>Cancelar</button>
                                    </div>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <h2>Crear profesor</h2>
            <input placeholder="Correo o usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
            <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input placeholder="Grado (ej: 1)" value={grado} onChange={(e) => setGrado(e.target.value)} />
            <input placeholder="Sección (ej: A)" value={seccion} onChange={(e) => setSeccion(e.target.value)} />
            <button onClick={handleCrearProfesor}>Crear profesor</button>
            <p>{resultado}</p>
        </main>
    );
}