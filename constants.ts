
import { Region } from './types';

export const API_BASE_URL = "https://pokeapi.co/api/v2";
export const POKEMON_PAGE_LIMIT = 50;
// ..
export const REGIONS: Region[] = [
    { name: 'Kanto', limit: 151, offset: 0 },
    { name: 'Johto', limit: 100, offset: 151 },
    { name: 'Hoenn', limit: 135, offset: 251 },
    { name: 'Sinnoh', limit: 107, offset: 386 },
    { name: 'Unova', limit: 156, offset: 493 },
    { name: 'Kalos', limit: 72, offset: 649 },
    { name: 'Alola', limit: 88, offset: 721 },
    { name: 'Galar', limit: 89, offset: 809 },
    { name: 'Paldea', limit: 120, offset: 905 },
];

export const LEGENDARY_AND_MYTHICAL_POKEMON: string[] = [
    "mewtwo", "mew", "raikou", "entei", "suicune", "lugia", "ho-oh", "celebi",
    "regirock", "regice", "registeel", "latias", "latios", "kyogre", "groudon", "rayquaza", "jirachi", "deoxys-normal",
    "uxie", "mesprit", "azelf", "dialga", "palkia", "heatran", "regigigas", "giratina-altered", "cresselia", "phione", "manaphy", "darkrai", "shaymin-land", "arceus",
    "victini", "cobalion", "terrakion", "virizion", "tornadus-incarnate", "thundurus-incarnate", "reshiram", "zekrom", "landorus-incarnate", "kyurem", "keldeo-ordinary", "meloetta-aria", "genesect",
    "xerneas", "yveltal", "zygarde-50", "diancie", "hoopa", "volcanion",
    "type-null", "silvally", "tapu-koko", "tapu-lele", "tapu-bulu", "tapu-fini", "cosmog", "cosmoem", "solgaleo", "lunala", "necrozma", "magearna", "marshadow", "zeraora", "meltan", "melmetal",
    "zacian", "zamazenta", "eternatus", "kubfu", "urshifu-single-strike", "regieleki", "regidrago", "glastrier", "spectrier", "calyrex", "enamorus-incarnate",
    "wo-chien", "chien-pao", "ting-lu", "chi-yu", "koraidon", "miraidon", "walking-wake", "iron-leaves", "okidogi", "munkidori", "fezandipiti", "ogerpon", "pecharunt"
];


export const TYPE_COLORS: { [key: string]: string } = {
    normal: 'bg-gray-400 border-gray-500',
    fire: 'bg-red-500 border-red-600',
    water: 'bg-blue-500 border-blue-600',
    electric: 'bg-yellow-400 border-yellow-500',
    grass: 'bg-green-500 border-green-600',
    ice: 'bg-cyan-300 border-cyan-400',
    fighting: 'bg-orange-700 border-orange-800',
    poison: 'bg-purple-600 border-purple-700',
    ground: 'bg-yellow-600 border-yellow-700',
    flying: 'bg-indigo-400 border-indigo-500',
    psychic: 'bg-pink-500 border-pink-600',
    bug: 'bg-lime-500 border-lime-600',
    rock: 'bg-yellow-700 border-yellow-800',
    ghost: 'bg-indigo-700 border-indigo-800',
    dragon: 'bg-indigo-500 border-indigo-600',
    dark: 'bg-gray-700 border-gray-800',
    steel: 'bg-gray-500 border-gray-600',
    fairy: 'bg-pink-300 border-pink-400',
};

export const TYPE_GRADIENTS: { [key: string]: string } = {
    normal: 'from-gray-400 to-gray-500',
    fire: 'from-red-500 to-orange-500',
    water: 'from-blue-500 to-cyan-400',
    electric: 'from-yellow-400 to-yellow-500',
    grass: 'from-green-500 to-lime-500',
    ice: 'from-cyan-300 to-blue-300',
    fighting: 'from-orange-700 to-red-700',
    poison: 'from-purple-600 to-fuchsia-600',
    ground: 'from-yellow-600 to-orange-700',
    flying: 'from-indigo-400 to-sky-400',
    psychic: 'from-pink-500 to-purple-500',
    bug: 'from-lime-500 to-green-400',
    rock: 'from-yellow-700 to-stone-500',
    ghost: 'from-indigo-700 to-purple-800',
    dragon: 'from-indigo-500 to-red-600',
    dark: 'from-gray-700 to-black',
    steel: 'from-gray-500 to-slate-600',
    fairy: 'from-pink-300 to-rose-400',
};

export const POKEMON_COLOR_GRADIENTS: { [key: string]: string } = {
    black: 'from-gray-800 to-black',
    blue: 'from-blue-500 to-sky-700',
    brown: 'from-yellow-700 to-orange-900',
    gray: 'from-gray-500 to-slate-700',
    green: 'from-green-500 to-emerald-700',
    pink: 'from-pink-400 to-rose-600',
    purple: 'from-purple-600 to-indigo-800',
    red: 'from-red-600 to-rose-800',
    white: 'from-slate-300 to-gray-400',
    yellow: 'from-yellow-400 to-amber-600',
};

export const TYPE_GLOW_COLORS: { [key: string]: string } = {
    normal: 'rgba(168, 162, 158, 0.4)',
    fire: 'rgba(239, 68, 68, 0.5)',
    water: 'rgba(59, 130, 246, 0.5)',
    electric: 'rgba(251, 191, 36, 0.6)',
    grass: 'rgba(34, 197, 94, 0.5)',
    ice: 'rgba(103, 232, 249, 0.5)',
    fighting: 'rgba(220, 38, 38, 0.4)',
    poison: 'rgba(168, 85, 247, 0.5)',
    ground: 'rgba(202, 138, 4, 0.4)',
    flying: 'rgba(96, 165, 250, 0.4)',
    psychic: 'rgba(236, 72, 153, 0.5)',
    bug: 'rgba(132, 204, 22, 0.5)',
    rock: 'rgba(180, 151, 90, 0.4)',
    ghost: 'rgba(124, 58, 237, 0.5)',
    dragon: 'rgba(99, 102, 241, 0.5)',
    dark: 'rgba(75, 85, 99, 0.5)',
    steel: 'rgba(156, 163, 175, 0.5)',
    fairy: 'rgba(244, 114, 182, 0.4)',
};
