import Image from "next/image";

export default async function Home() {

  const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/impresiones', { cache: 'no-store' });
  const impresiones = await res.json();

  return (
    <main>
      <h1>Impresiones Pendientes</h1>
      <ul>
        {impresiones.map((item: any, index: number) => (
          <li key={index}>
            {item.profesor} - {item.seccion} - {item.hora} - {item.descripcion}
          </li>
        ))}
      </ul>
    </main>
  );
}
