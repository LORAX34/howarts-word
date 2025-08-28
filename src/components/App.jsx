import { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [personajes, setPersonajes] = useState([]);
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const [casaFiltro, setCasaFiltro] = useState("Todas");
    const personajesPorPagina = 8;

    useEffect(() => {
        const cargarPersonajes = async () => {
            try {
                setCargando(true);
                const response = await fetch("./personajes.json");
                const data = await response.json();
                setPersonajes(data);
            } catch (error) {
                console.error("Error cargando personajes:", error);
            } finally {
                setCargando(false);
            }
        };
        cargarPersonajes();
    }, []);

    // Filtrar personajes según búsqueda y casa
    const personajesFiltrados = personajes.filter((personaje) => {
        const coincideNombre = personaje.name
            .toLowerCase()
            .includes(busqueda.toLowerCase());
        const coincideCasa =
            casaFiltro === "Todas" || personaje.house === casaFiltro;
        return coincideNombre && coincideCasa;
    });

    // Paginación
    const indiceUltimoPersonaje = paginaActual * personajesPorPagina;
    const indicePrimerPersonaje = indiceUltimoPersonaje - personajesPorPagina;
    const personajesActuales = personajesFiltrados.slice(
        indicePrimerPersonaje,
        indiceUltimoPersonaje,
    );
    const totalPaginas = Math.ceil(
        personajesFiltrados.length / personajesPorPagina,
    );

    // Función para obtener colores según la casa
    const getHouseColors = (house) => {
        switch (house) {
            case "Gryffindor":
                return {
                    primary: "#740001",
                    secondary: "#D3A625",
                    accent: "#EEBA30",
                    light: "#FFD8A8",
                };
            case "Slytherin":
                return {
                    primary: "#1A472A",
                    secondary: "#5D5D5D",
                    accent: "#AAAAAA",
                    light: "#C0C0C0",
                };
            case "Hufflepuff":
                return {
                    primary: "#FFD800",
                    secondary: "#000000",
                    accent: "#60605C",
                    light: "#FFF4BD",
                };
            case "Ravenclaw":
                return {
                    primary: "#0E1A40",
                    secondary: "#946B2D",
                    accent: "#5D5D5D",
                    light: "#B2C8E0",
                };
            default:
                return {
                    primary: "#2C3E50",
                    secondary: "#95A5A6",
                    accent: "#ECF0F1",
                    light: "#EAEDED",
                };
        }
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return "Desconocido";
        const [day, month, year] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    // Cambiar página
    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (cargando) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-golden-light border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-golden rounded-full animate-ping"></div>
                    </div>
                    <p className="mt-4 text-golden-light text-center font-semibold">
                        Cargando personajes...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gradient-to-b from-gray-800 to-gray-900 py-6 md:py-8 text-center shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-hogwarts-background bg-cover bg-center"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-harry font-bold text-golden mb-2 tracking-wide">
                        El Mundo Mágico de Harry Potter
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mt-2 max-w-2xl mx-auto">
                        Explora los personajes del universo mágico y descubre
                        sus secretos
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {/* Filtros y búsqueda */}
                <div className="mb-8 bg-gray-800 p-4 rounded-xl shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="w-full md:w-1/2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar personaje..."
                                    value={busqueda}
                                    onChange={(e) => {
                                        setBusqueda(e.target.value);
                                        setPaginaActual(1);
                                    }}
                                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                                />
                                <span className="absolute right-3 top-3 text-gray-400">
                                    <i className="fas fa-search"></i>
                                </span>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3">
                            <select
                                value={casaFiltro}
                                onChange={(e) => {
                                    setCasaFiltro(e.target.value);
                                    setPaginaActual(1);
                                }}
                                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-golden"
                            >
                                <option value="Todas">Todas las casas</option>
                                <option value="Gryffindor">Gryffindor</option>
                                <option value="Slytherin">Slytherin</option>
                                <option value="Hufflepuff">Hufflepuff</option>
                                <option value="Ravenclaw">Ravenclaw</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Información de resultados */}
                <div className="mb-6 flex justify-between items-center">
                    <p className="text-gray-400">
                        Mostrando {personajesActuales.length} de{" "}
                        {personajesFiltrados.length} personajes
                    </p>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Ordenar por:</span>
                        <select className="px-3 py-1 bg-gray-700 rounded-lg">
                            <option>Nombre</option>
                            <option>Casa</option>
                            <option>Fecha de nacimiento</option>
                        </select>
                    </div>
                </div>

                {/* Grid de personajes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {personajesActuales.map((personaje, index) => {
                        const houseColors = getHouseColors(personaje.house);

                        return (
                            <div
                                key={personaje.id}
                                className="rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 cursor-pointer animate-fade-in"
                                style={{
                                    background: `linear-gradient(145deg, ${houseColors.primary} 0%, ${houseColors.secondary} 100%)`,
                                    border: `2px solid ${houseColors.accent}`,
                                    animationDelay: `${index * 0.1}s`,
                                }}
                                onClick={() =>
                                    setPersonajeSeleccionado(personaje)
                                }
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={personaje.image}
                                        alt={personaje.name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                    />
                                    <div className="absolute top-0 right-0 m-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold ${personaje.alive ? "bg-green-500" : "bg-red-500"}`}
                                        >
                                            {personaje.alive
                                                ? "VIVO"
                                                : "FALLECIDO"}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 text-white">
                                    <h3 className="text-xl font-bold mb-2 truncate">
                                        {personaje.name}
                                    </h3>

                                    <div className="flex items-center mb-2">
                                        <span
                                            className="px-3 py-1 rounded-full text-sm font-semibold"
                                            style={{
                                                backgroundColor:
                                                    houseColors.light,
                                                color: houseColors.primary,
                                            }}
                                        >
                                            {personaje.house || "Sin casa"}
                                        </span>
                                    </div>

                                    <div className="text-sm space-y-1 mb-3">
                                        <p className="truncate">
                                            <span className="font-semibold">
                                                Actor:
                                            </span>{" "}
                                            {personaje.actor}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Especie:
                                            </span>{" "}
                                            {personaje.species}
                                        </p>
                                    </div>

                                    <button className="w-full bg-black bg-opacity-30 hover:bg-opacity-50 py-2 rounded-lg transition-all duration-300 flex items-center justify-center group">
                                        Ver detalles
                                        <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                                            →
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Paginación */}
                {totalPaginas > 1 && (
                    <div className="flex justify-center mt-8 mb-12">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => cambiarPagina(paginaActual - 1)}
                                disabled={paginaActual === 1}
                                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                            >
                                Anterior
                            </button>

                            {[...Array(totalPaginas)].map((_, index) => {
                                const pagina = index + 1;
                                // Mostrar solo algunas páginas alrededor de la actual
                                if (
                                    pagina === 1 ||
                                    pagina === totalPaginas ||
                                    (pagina >= paginaActual - 1 &&
                                        pagina <= paginaActual + 1)
                                ) {
                                    return (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                cambiarPagina(pagina)
                                            }
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                pagina === paginaActual
                                                    ? "bg-golden text-gray-900 font-bold"
                                                    : "bg-gray-800 hover:bg-gray-700"
                                            }`}
                                        >
                                            {pagina}
                                        </button>
                                    );
                                } else if (
                                    pagina === paginaActual - 2 ||
                                    pagina === paginaActual + 2
                                ) {
                                    return (
                                        <span key={index} className="px-2 py-2">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}

                            <button
                                onClick={() => cambiarPagina(paginaActual + 1)}
                                disabled={paginaActual === totalPaginas}
                                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Modal de detalles */}
            {personajeSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div
                        className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <button
                                onClick={() => setPersonajeSeleccionado(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
                            >
                                <span className="text-white text-xl">×</span>
                            </button>

                            <div
                                className="h-48 md:h-64 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${personajeSeleccionado.image})`,
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                                    {personajeSeleccionado.name}
                                </h2>
                                {personajeSeleccionado.house && (
                                    <div
                                        className="inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold"
                                        style={{
                                            backgroundColor: getHouseColors(
                                                personajeSeleccionado.house,
                                            ).light,
                                            color: getHouseColors(
                                                personajeSeleccionado.house,
                                            ).primary,
                                        }}
                                    >
                                        {personajeSeleccionado.house}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 grid md:grid-cols-2 gap-6">
                            <div className="animate-slide-in-left">
                                <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-700">
                                    Información Básica
                                </h3>
                                <div className="space-y-3">
                                    <InfoItem
                                        label="Especie"
                                        value={personajeSeleccionado.species}
                                    />
                                    <InfoItem
                                        label="Género"
                                        value={personajeSeleccionado.gender}
                                    />
                                    <InfoItem
                                        label="Ascendencia"
                                        value={personajeSeleccionado.ancestry}
                                    />
                                    <InfoItem
                                        label="Nacimiento"
                                        value={formatDate(
                                            personajeSeleccionado.dateOfBirth,
                                        )}
                                    />
                                    <InfoItem
                                        label="Estado"
                                        value={
                                            personajeSeleccionado.alive
                                                ? "🟢 Vivo"
                                                : "🔴 Fallecido"
                                        }
                                    />
                                    <InfoItem
                                        label="Actor/Actriz"
                                        value={personajeSeleccionado.actor}
                                    />
                                </div>
                            </div>

                            <div className="animate-slide-in-right">
                                <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-700">
                                    Características Mágicas
                                </h3>
                                <div className="space-y-3">
                                    <InfoItem
                                        label="Patronus"
                                        value={
                                            personajeSeleccionado.patronus ||
                                            "Desconocido"
                                        }
                                    />
                                    <InfoItem
                                        label="Varita"
                                        value={
                                            personajeSeleccionado.wand
                                                ? `${personajeSeleccionado.wand.wood}, núcleo de ${personajeSeleccionado.wand.core}, ${personajeSeleccionado.wand.length} pulgadas`
                                                : "Desconocida"
                                        }
                                    />
                                    <InfoItem
                                        label="Estudiante de Hogwarts"
                                        value={
                                            personajeSeleccionado.hogwartsStudent
                                                ? "Sí"
                                                : "No"
                                        }
                                    />
                                    <InfoItem
                                        label="Personal de Hogwarts"
                                        value={
                                            personajeSeleccionado.hogwartsStaff
                                                ? "Sí"
                                                : "No"
                                        }
                                    />
                                    <InfoItem
                                        label="Mago"
                                        value={
                                            personajeSeleccionado.wizard
                                                ? "Sí"
                                                : "No"
                                        }
                                    />
                                </div>
                            </div>

                            {personajeSeleccionado.alternate_names &&
                                personajeSeleccionado.alternate_names.length >
                                    0 && (
                                    <div className="md:col-span-2 animate-fade-in">
                                        <h3 className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-700">
                                            Nombres Alternativos
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {personajeSeleccionado.alternate_names.map(
                                                (name, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                                                    >
                                                        {name}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}

            <footer className="bg-gray-800 py-6 text-center text-gray-400">
                <p>
                    El Mundo Mágico de Harry Potter - Todos los derechos mágicos
                    reservados
                </p>
            </footer>
        </div>
    );
}

// Componente auxiliar para mostrar items de información
function InfoItem({ label, value }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start">
            <span className="font-bold text-golden-light min-w-[140px]">
                {label}:
            </span>
            <span className="sm:ml-2">{value || "Desconocido"}</span>
        </div>
    );
}

export default App;
