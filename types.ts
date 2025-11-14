export interface PokemonListResult {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
  species: {
    name: string;
    url: string;
  };
}

export interface Region {
  name: string;
  limit: number;
  offset: number;
}

// Types for Evolution Chain
export interface Species {
  evolution_chain: {
    url: string;
  };
  color: {
    name: string;
  };
}

export interface EvolutionNode {
  species: {
    name: string;
    url: string; 
  };
  evolves_to: EvolutionNode[];
}

export interface EvolutionChain {
  chain: EvolutionNode;
}

export interface MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  type: {
    name: string;
  };
  damage_class: {
    name: string;
  };
}