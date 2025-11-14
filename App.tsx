
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pokemon, PokemonListResult, Region, Species, EvolutionChain, EvolutionNode } from './types';
import { API_BASE_URL, POKEMON_PAGE_LIMIT, REGIONS, TYPE_COLORS, TYPE_GRADIENTS, LEGENDARY_AND_MYTHICAL_POKEMON, POKEMON_COLOR_GRADIENTS, TYPE_GLOW_COLORS } from './constants';

// HELPER FUNCTIONS & ASSETS
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const fetchJson = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const getPokemonIdFromUrl = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 2];
};

// --- SUB-COMPONENTS ---

const MasterBallIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`${className} drop-shadow-lg`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#A78BFA" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12H22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 7.5L19 5" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path fill="#F472B6" d="M10.5 12.75L10.5 10.5L11.25 11.5L12 10.5L12.75 11.5L13.5 10.5L13.5 12.75" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const PokeballIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="4" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="50" cy="50" r="7" fill="currentColor" />
    </svg>
);

const DetailedPokeballIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1"/>
        <path d="M2 50H98" stroke="currentColor" strokeWidth="3"/>
        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2"/>
        <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="1"/>
        <path d="M50 2C50 2 62 25 50 50C38 25 50 2 50 2Z" fill="currentColor" opacity="0.1"/>
        <path d="M50 98C50 98 62 75 50 50C38 75 50 98 50 98Z" fill="currentColor" opacity="0.1"/>
    </svg>
);

interface TypeBadgeProps {
    type: string;
}
const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => (
    <span className={`px-3 py-1 text-xs font-bold text-white rounded-full shadow-md ${TYPE_COLORS[type] || 'bg-gray-400 border-gray-500'} border-2`}>
        {capitalize(type)}
    </span>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
);

interface StatBarProps {
    stat: { name: string; value: number };
    delay: number;
}
const StatBar: React.FC<StatBarProps> = ({ stat, delay }) => {
    const statPercentage = (stat.value / 255) * 100;
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth(statPercentage);
        }, delay);
        return () => clearTimeout(timer);
    }, [statPercentage, delay]);

    return (
        <div className="flex items-center w-full">
            <span className="w-1/3 text-sm font-semibold text-purple-200">{capitalize(stat.name.replace('-', ' '))}</span>
            <div className="w-2/3 bg-purple-800 rounded-full h-4 relative overflow-hidden">
                <div 
                    className="bg-pink-400 h-4 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${width}%` }}
                ></div>
                 <span className="absolute right-2 top-0 text-xs font-bold text-white">{stat.value}</span>
            </div>
        </div>
    );
};

interface PokemonCardProps {
    pokemon: Pokemon;
    onClick: () => void;
}
const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
    const primaryType = pokemon.types[0].type.name;
    const typeColor = TYPE_COLORS[primaryType]?.split(' ')[0] || 'bg-gray-400';

    return (
        <div 
            className={`cursor-pointer group relative p-4 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl ${typeColor} bg-opacity-30 border-2 ${TYPE_COLORS[primaryType]?.split(' ')[1] || 'border-gray-500'} overflow-hidden`}
            onClick={onClick}
        >
            <PokeballIcon className="absolute -top-4 -right-4 w-28 h-28 text-white opacity-10 transition-transform duration-300 group-hover:rotate-12" />
            <div className="absolute top-2 left-2 px-3 py-1 bg-purple-900 bg-opacity-70 rounded-full text-sm font-bold text-pink-300 z-10">
                #{String(pokemon.id).padStart(3, '0')}
            </div>
            <div className="relative h-32 sm:h-40 flex justify-center items-end">
                <img 
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
                    alt={pokemon.name} 
                    className="h-full w-full object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110 z-10"
                />
                <div className="absolute bottom-0 w-3/4 h-8 bg-green-500 bg-opacity-50 rounded-full blur-md"></div>
            </div>
            <h3 className="text-center mt-4 text-xl font-bold text-white capitalize truncate">{pokemon.name}</h3>
            <div className="flex justify-center gap-2 mt-2">
                {pokemon.types.map(({ type }) => (
                    <TypeBadge key={type.name} type={type.name} />
                ))}
            </div>
        </div>
    );
};

const AnimatedArrow: React.FC<{ delay: number }> = ({ delay }) => (
    <div 
        className="text-pink-400 text-4xl font-bold animate-pulse-arrow animate-fade-in"
        style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 5L20 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
);

const EvolutionChainDisplay: React.FC<{ speciesUrl: string }> = ({ speciesUrl }) => {
    const [chain, setChain] = useState<EvolutionNode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvolutionChain = async () => {
            try {
                setLoading(true);
                const speciesData = await fetchJson<Species>(speciesUrl);
                const chainData = await fetchJson<EvolutionChain>(speciesData.evolution_chain.url);
                
                const parsedChain: EvolutionNode[] = [];
                let currentNode = chainData.chain;
                while (currentNode) {
                    parsedChain.push(currentNode);
                    currentNode = currentNode.evolves_to[0];
                }
                setChain(parsedChain);
            } catch (error) {
                console.error("Failed to fetch evolution chain:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvolutionChain();
    }, [speciesUrl]);

    if (loading) return <div className="flex justify-center p-4"><LoadingSpinner/></div>;
    if (chain.length <= 1) return <p className="text-center text-purple-300 mt-4">This Pokémon does not evolve.</p>;

    return (
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            {chain.map((node, index) => (
                <React.Fragment key={node.species.name}>
                    <div 
                        className="flex flex-col items-center animate-fade-in-pop transition-transform duration-300 hover:scale-105 cursor-pointer group"
                        style={{ animationDelay: `${index * 250}ms`, opacity: 0 }}
                    >
                        <div className="w-24 h-24 p-2 bg-purple-950/50 rounded-full border-2 border-pink-500 group-hover:border-pink-300 group-hover:bg-purple-950/80 transition-colors">
                             <img 
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonIdFromUrl(node.species.url)}.png`}
                                alt={node.species.name}
                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <p className="capitalize mt-2 text-sm font-bold group-hover:text-pink-300 transition-colors">{node.species.name}</p>
                    </div>
                    {index < chain.length - 1 && (
                         <AnimatedArrow delay={index * 250 + 125} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

interface PokemonDetailProps {
    pokemon: Pokemon;
    onBackClick: () => void;
    onNavigate: (direction: 'next' | 'prev') => void;
    isFirst: boolean;
    isLast: boolean;
}
const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onBackClick, onNavigate, isFirst, isLast }) => {
    const [pokemonColor, setPokemonColor] = useState<string | null>(null);

    useEffect(() => {
        const fetchColor = async () => {
            try {
                const speciesData = await fetchJson<Species>(pokemon.species.url);
                setPokemonColor(speciesData.color.name);
            } catch (e) {
                console.error("Failed to fetch pokemon color", e);
                setPokemonColor(null);
            }
        };
        fetchColor();
    }, [pokemon.species.url]);

    const getGradient = () => {
        if (pokemonColor && POKEMON_COLOR_GRADIENTS[pokemonColor]) {
            return `bg-gradient-to-br ${POKEMON_COLOR_GRADIENTS[pokemonColor]}`;
        }
        const primaryType = pokemon.types[0].type.name;
        const secondaryType = pokemon.types[1]?.type.name;
        return secondaryType 
            ? `bg-gradient-to-br ${TYPE_GRADIENTS[primaryType]} ${TYPE_GRADIENTS[secondaryType].replace('from-', 'to-')}` 
            : `bg-gradient-to-br ${TYPE_GRADIENTS[primaryType]} to-purple-900`;
    }

    const gradient = getGradient();
    const stats = pokemon.stats.map(s => ({ name: s.stat.name, value: s.base_stat }));
    const primaryType = pokemon.types[0].type.name;
    const glowColor = TYPE_GLOW_COLORS[primaryType] || 'rgba(168, 162, 158, 0.4)';

    return (
        <div className={`fixed inset-0 z-50 p-4 animate-fade-in ${gradient} bg-pattern overflow-y-auto`}>
             <div 
                className="absolute inset-0 z-0" 
                style={{
                    background: `radial-gradient(circle at 50% 40%, ${glowColor} 0%, transparent 60%)`
                }}
            />
            <DetailedPokeballIcon className="absolute top-1/2 left-1/2 w-[80vh] h-[80vh] text-white opacity-5 animate-spin-slow z-0" />
            
            <div className="max-w-4xl mx-auto text-white relative z-10">
                <button 
                    onClick={onBackClick}
                    aria-label="Back to list"
                    className="absolute top-4 left-4 z-20 w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group"
                >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-b from-red-500 to-red-600 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-gray-400"></div>
                        </div>
                    </div>
                </button>
                
                <div className="relative pt-20 text-center">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                        {!isFirst && 
                            <button onClick={() => onNavigate('prev')} aria-label="Previous Pokémon" className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 text-white/50 hover:text-white transition text-6xl drop-shadow-lg">&lt;</button>
                        }
                        <img
                            src={pokemon.sprites.other['official-artwork'].front_default}
                            alt={pokemon.name}
                            className="relative z-10 w-full h-full drop-shadow-2xl animate-float"
                        />
                        {!isLast && 
                            <button onClick={() => onNavigate('next')} aria-label="Next Pokémon" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 text-white/50 hover:text-white transition text-6xl drop-shadow-lg">&gt;</button>
                        }
                        <div className="absolute inset-0 bg-black/20 rounded-full blur-2xl top-1/2"></div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black capitalize drop-shadow-lg mt-4">{pokemon.name}</h1>
                    <p className="text-2xl font-bold text-purple-200">#{String(pokemon.id).padStart(3, '0')}</p>
                    <div className="flex justify-center gap-2 mt-4">
                        {pokemon.types.map(({ type }) => (
                            <TypeBadge key={type.name} type={type.name} />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 bg-purple-900 bg-opacity-50 p-6 rounded-2xl shadow-inner">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-bold text-pink-400 border-b-2 border-pink-500 pb-2">Info</h2>
                        <div className="grid grid-cols-2 text-lg">
                            <p><span className="font-bold text-purple-300">Height:</span> {pokemon.height / 10} m</p>
                            <p><span className="font-bold text-purple-300">Weight:</span> {pokemon.weight / 10} kg</p>
                        </div>
                        <h3 className="text-2xl font-bold text-pink-400 mt-4">Abilities</h3>
                        <ul className="list-disc list-inside text-lg">
                            {pokemon.abilities.map(({ ability, is_hidden }) => (
                                <li key={ability.name} className="capitalize">
                                    {ability.name.replace('-', ' ')} {is_hidden && '(Hidden)'}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-3xl font-bold text-pink-400 border-b-2 border-pink-500 pb-2">Base Stats</h2>
                        {stats.map((stat, index) => (
                            <StatBar key={stat.name} stat={stat} delay={index * 100} />
                        ))}
                    </div>
                </div>
                
                <div className="mt-8 bg-purple-900 bg-opacity-50 p-6 rounded-2xl shadow-inner">
                    <h2 className="text-3xl font-bold text-pink-400 border-b-2 border-pink-500 pb-2 mb-4">Evolution Chain</h2>
                    <EvolutionChainDisplay speciesUrl={pokemon.species.url} />
                </div>

                <div className="mt-8 bg-purple-900 bg-opacity-50 p-6 rounded-2xl shadow-inner">
                    <h2 className="text-3xl font-bold text-pink-400 border-b-2 border-pink-500 pb-2 mb-4">Notable Moves</h2>
                    <div className="flex flex-wrap gap-2">
                        {pokemon.moves.slice(0, 15).map(({ move }, index) => (
                            <span 
                                key={move.name} 
                                className="bg-purple-800 px-3 py-1 rounded-full text-sm capitalize animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                            >
                                {move.name.replace('-', ' ')}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                
                @keyframes fade-in-pop {
                    0% { opacity: 0; transform: translateY(10px) scale(0.9); }
                    70% { opacity: 1; transform: translateY(0) scale(1.05); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-pop { animation: fade-in-pop 0.6s ease-out forwards; }

                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }

                @keyframes pulse-arrow { 
                    0%, 100% { transform: scale(1); opacity: 0.7; } 
                    50% { transform: scale(1.1); opacity: 1; }
                }
                .animate-pulse-arrow { animation: pulse-arrow 2s ease-in-out infinite; }

                @keyframes spin-slow {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 60s linear infinite; }

                .bg-pattern {
                    background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f472b6" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
                }
            `}</style>
        </div>
    );
};


interface HeaderProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    types: string[];
    selectedType: string;
    onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    regions: Region[];
    selectedRegion: string;
    onRegionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange, types, selectedType, onTypeChange, regions, selectedRegion, onRegionChange }) => {
    return (
        <header className="sticky top-0 z-40 bg-purple-900/80 backdrop-blur-sm shadow-lg p-4">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <MasterBallIcon className="w-10 h-10" />
                    <h1 className="text-4xl font-bold text-pink-400" style={{ textShadow: '0 0 8px #f472b6' }}>MasterDex</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search current list..."
                        value={searchTerm}
                        onChange={onSearchChange}
                        className="bg-purple-950 text-white border-2 border-pink-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 w-full sm:w-auto"
                    />
                    <select value={selectedType} onChange={onTypeChange} className="bg-purple-950 text-white border-2 border-pink-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400">
                        <option value="">All Types</option>
                        {types.map(type => <option key={type} value={type}>{capitalize(type)}</option>)}
                    </select>
                     <select value={selectedRegion} onChange={onRegionChange} className="bg-purple-950 text-white border-2 border-pink-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400">
                        <option value="">All Regions</option>
                        {regions.map(region => <option key={region.name} value={region.name}>{capitalize(region.name)}</option>)}
                        <option value="Legendaries">Legendaries</option>
                    </select>
                </div>
            </div>
        </header>
    );
}

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    const [sourcePokemon, setSourcePokemon] = useState<Pokemon[]>([]); // The unfiltered source
    const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]); // The filtered list to render
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [types, setTypes] = useState<string[]>([]);
    
    const observer = useRef<IntersectionObserver>();
    const loaderRef = useRef<HTMLDivElement>(null);
    const isFilterActive = !!selectedType || !!selectedRegion;

    // Fetch Pokemon types for filter dropdown
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const data = await fetchJson<{ results: { name: string }[] }>(`${API_BASE_URL}/type`);
                setTypes(data.results.map(t => t.name).filter(t => t !== 'unknown' && t !== 'shadow'));
            } catch (error) { console.error("Failed to fetch types:", error); }
        };
        fetchTypes();
    }, []);

    const fetchAndSetPokemonDetails = async (pokemonList: { pokemon?: PokemonListResult; }[] | PokemonListResult[]) => {
        // This function now handles both {pokemon: {url: ...}} and {url: ...} structures
        const pokemonUrls = pokemonList.map(p => 'pokemon' in p && p.pokemon ? p.pokemon.url : (p as PokemonListResult).url);
        const uniqueUrls = [...new Set(pokemonUrls)];
        const pokemonPromises = uniqueUrls.map(url => fetchJson<Pokemon>(url));
        const pokemonDetails = await Promise.all(pokemonPromises);
        pokemonDetails.sort((a,b) => a.id - b.id);
        setSourcePokemon(pokemonDetails);
        setLoading(false);
    };

    // Main data fetching logic based on filters
    useEffect(() => {
        const fetchFilteredPokemon = async () => {
            setLoading(true);
            setSourcePokemon([]);
            setSearchTerm('');
            
            try {
                if (selectedRegion === 'Legendaries') {
                    const legendaryPromises = LEGENDARY_AND_MYTHICAL_POKEMON.map(name =>
                        fetchJson<Pokemon>(`${API_BASE_URL}/pokemon/${name}`)
                    );
                    const results = await Promise.allSettled(legendaryPromises);
                    const successfulResults = results
                        .filter(r => r.status === 'fulfilled')
                        .map(r => (r as PromiseFulfilledResult<Pokemon>).value);
                    successfulResults.sort((a, b) => a.id - b.id);
                    setSourcePokemon(successfulResults);
                    setLoading(false);

                } else if (selectedRegion) {
                    const region = REGIONS.find(r => r.name === selectedRegion);
                    if (!region) return;
                    const data = await fetchJson<{ results: PokemonListResult[] }>(`${API_BASE_URL}/pokemon?limit=${region.limit}&offset=${region.offset}`);
                    await fetchAndSetPokemonDetails(data.results);
                } else if (selectedType) {
                    const data = await fetchJson<{ pokemon: { pokemon: PokemonListResult }[] }>(`${API_BASE_URL}/type/${selectedType}`);
                    await fetchAndSetPokemonDetails(data.pokemon);
                } else {
                    // No filter, reset to infinite scroll
                    setOffset(0);
                    setHasMore(true);
                    fetchPokemonBatch(0, true);
                }
            } catch (error) {
                console.error("Failed to fetch filtered Pokemon", error);
                setLoading(false);
            }
        };

        fetchFilteredPokemon();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRegion, selectedType]);


    // Function to fetch a batch of Pokemon for infinite scroll
    const fetchPokemonBatch = useCallback(async (currentOffset: number, isReset: boolean = false) => {
        if (loading && !isReset) return;
        setLoading(true);
        try {
            const listData = await fetchJson<{ results: PokemonListResult[] }>(`${API_BASE_URL}/pokemon?limit=${POKEMON_PAGE_LIMIT}&offset=${currentOffset}`);
            
            if (listData.results.length === 0) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            const pokemonPromises = listData.results.map(p => fetchJson<Pokemon>(p.url));
            const pokemonDetails = await Promise.all(pokemonPromises);

            setSourcePokemon(prev => {
                if (isReset) return pokemonDetails;
                const newPokemon = pokemonDetails.filter(p => !prev.some(ep => ep.id === p.id));
                return [...prev, ...newPokemon].sort((a,b) => a.id - b.id);
            });
            setOffset(currentOffset + POKEMON_PAGE_LIMIT);
        } catch (error) {
            console.error("Failed to fetch Pokemon:", error);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    // Infinite scroll observer setup
    useEffect(() => {
        if (isFilterActive || loading) return;

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchPokemonBatch(offset);
            }
        }, { rootMargin: '200px' });

        if (loaderRef.current) observer.current.observe(loaderRef.current);
        return () => { if (observer.current) observer.current.disconnect(); };
    }, [loading, hasMore, offset, fetchPokemonBatch, isFilterActive]);

    // Apply search term filter
    useEffect(() => {
        let filtered = sourcePokemon;
        if (searchTerm) {
            filtered = sourcePokemon.filter(pokemon => 
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setDisplayedPokemon(filtered);
    }, [searchTerm, sourcePokemon]);

    const handleCardClick = (pokemon: Pokemon) => setSelectedPokemon(pokemon);
    const handleBackClick = () => setSelectedPokemon(null);

    const handleNavigation = (direction: 'next' | 'prev') => {
        if (!selectedPokemon) return;
        const currentIndex = displayedPokemon.findIndex(p => p.id === selectedPokemon.id);
        const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < displayedPokemon.length) {
            setSelectedPokemon(displayedPokemon[nextIndex]);
        }
    };
    
    const currentIndex = selectedPokemon ? displayedPokemon.findIndex(p => p.id === selectedPokemon.id) : -1;

    return (
        <div className="min-h-screen text-white font-sans">
            {selectedPokemon ? (
                <PokemonDetail 
                    pokemon={selectedPokemon} 
                    onBackClick={handleBackClick}
                    onNavigate={handleNavigation}
                    isFirst={currentIndex === 0}
                    isLast={currentIndex === displayedPokemon.length - 1}
                />
            ) : (
                <>
                    <Header
                        searchTerm={searchTerm}
                        onSearchChange={e => setSearchTerm(e.target.value)}
                        types={types}
                        selectedType={selectedType}
                        onTypeChange={e => { setSelectedRegion(''); setSelectedType(e.target.value); }}
                        regions={REGIONS}
                        selectedRegion={selectedRegion}
                        onRegionChange={e => { setSelectedType(''); setSelectedRegion(e.target.value); }}
                    />

                    <main className="container mx-auto p-4">
                        {loading && displayedPokemon.length === 0 ? <LoadingSpinner /> : (
                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {displayedPokemon.map(pokemon => (
                                    <PokemonCard 
                                        key={pokemon.id} 
                                        pokemon={pokemon} 
                                        onClick={() => handleCardClick(pokemon)}
                                    />
                                ))}
                            </div>
                        )}
                        <div ref={loaderRef}>
                           {loading && displayedPokemon.length > 0 && <LoadingSpinner />}
                        </div>
                         {!hasMore && !loading && !isFilterActive && <p className="text-center text-purple-300 py-8">End of the MasterDex.</p>}
                         {isFilterActive && !loading && displayedPokemon.length === 0 && <p className="text-center text-purple-300 py-8">No Pokémon found for this filter.</p>}
                    </main>
                </>
            )}
        </div>
    );
};

export default App;
