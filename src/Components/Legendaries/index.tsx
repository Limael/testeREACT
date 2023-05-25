import { useEffect, useState } from "react";
import { Header } from "../Header";
import { LegendariesSection, PokemonProps } from "../LegendariesSection";
import api from "../../api/api";
import styles from './index.module.css';

interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

export const Legendaries = () => {
  const [legendaryPokemon, setLegendaryPokemon] = useState<PokemonProps | null>(null);
  const [pokemonDescription, setPokemonDescription] = useState<string>('');

  useEffect(() => {
    const fetchLegendaryPokemon = async () => {
      try {
        const response = await api.get('/pokemon?limit=10000');
        const results = response.data.results;

        for (const pokemon of results) {
          const pokemonResponse = await api.get(pokemon.url);
          const pokemonData = pokemonResponse.data;

          try {
            const speciesResponse = await api.get(`/pokemon-species/${pokemonData.id}`);
            const speciesData = speciesResponse.data;

            if (speciesData.is_legendary) {
              setLegendaryPokemon(pokemonData);

              const flavorTexts = speciesData.flavor_text_entries.filter(
                (entry: FlavorTextEntry) => entry.language.name === 'en'
              );
              const description = flavorTexts[0].flavor_text;
              setPokemonDescription(description);

              break;
            }
          } catch (error) {
            console.log(`Error fetching species for Pokemon with ID ${pokemonData.id}:`, error);
          }
        }
      } catch (error) {
        console.log('Error fetching legendary Pokemon:', error);
      }
    };

    fetchLegendaryPokemon();
  }, []);

  const getStatValue = (pokemon: PokemonProps | null, statName: string): number | undefined => {
    if (!pokemon) {
      return undefined;
    }

    if (statName === 'experience') {
      return pokemon.base_experience;
    }

    const stat = pokemon.stats.find((stat) => stat.stat.name === statName);
    return stat?.base_stat;
  };

  return (
    <>
      <Header />
      <section className={styles.section_container}>
        {legendaryPokemon && (
          <>
            <LegendariesSection
              title="Legendaries"
              img={legendaryPokemon.sprites.other['official-artwork'].front_default}
              pokemonName={legendaryPokemon.name}
              pokemonDescription={pokemonDescription}
              hp={getStatValue(legendaryPokemon, 'hp')}
              experience={getStatValue(legendaryPokemon, 'experience')}
              attack={getStatValue(legendaryPokemon, 'attack')}
              defense={getStatValue(legendaryPokemon, 'defense')}
              spAttack={getStatValue(legendaryPokemon, 'special-attack')}
              spDefense={getStatValue(legendaryPokemon, 'special-defense')}
            />
          </>
        )}
      </section>
    </>
  );
};
