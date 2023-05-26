import { useEffect, useState } from 'react';
import { Header } from '../Header';
import styles from './index.module.css';
import { Menu, MenuButton, MenuList, Button, SimpleGrid, CircularProgress, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, MenuItem, Checkbox, Progress } from '@chakra-ui/react';
import api from '../../api/api';
import { CardPokemon, PokemonTypeProps } from '../CardPokemon';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Badge } from '../Badge';

type PokemonType = {
  name: string;
  url: string;
};

const PAGE_SIZE = 9;

export const Pokedex = () => {
  const [pokemonCount, setPokemonCount] = useState<number>(0);
  const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]);
  const [pokemonList, setPokemonList] = useState<PokemonTypeProps[]>([]);
  const [pokemonSearchList, setPokemonSearchList] = useState<PokemonTypeProps[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


  const [selectedPokemon, setSelectedPokemon] = useState<PokemonTypeProps | null>(null);



  const [searchValue, setSearchValue] = useState('')
  useEffect(() => {
    const fetchPokemonList = async () => {
      if (searchValue.trim() === '') {
        setPokemonSearchList([])
        return;
      }

      setLoading(true);

      try {
        const response = await api.get(`/pokemon/${searchValue}`);
        const data = response.data;

        const pokemon: PokemonTypeProps = {
          name: data.name,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          types: data.types.map((type: { type: { name: string } } & PokemonType) => type.type.name),
          image: data.sprites.other['official-artwork'].front_default,
          onClick: () => handlePokemonClick(pokemon),
          hp: data.stats[0].base_stat,
          spAttack: data.stats[3].base_stat,
          spDefense: data.stats[4].base_stat,
          experience: data.base_experience,
          generation: data.game_indices[0].version.url.split('/').slice(-2, -1)[0],
          index: data.id,
          abilities: data.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),

        };


        setPokemonSearchList([pokemon]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchPokemonList();
  }, [searchValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };


  /*     const handleTypeSelect = (type: string) => {
          setSelectedTypes((prevSelectedTypes) => {
              if (prevSelectedTypes.includes(type)) {
                  return prevSelectedTypes.filter((selectedType) => selectedType !== type);
              } else {
                  return [...prevSelectedTypes, type];
              }
          });
      };
  
      useEffect(() => {
          const lastSelectedType = selectedTypes[selectedTypes.length - 1];
          console.log('Último tipo selecionado:', lastSelectedType);
      }, [selectedTypes]);
  
   */

  useEffect(() => {
    const fetchPokemonTypes = async () => {
      try {
        const response = await api.get('/type');
        setPokemonTypes(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPokemonTypes();
  }, []);

  /* 
      useEffect(() => {
          const fetchPokemonTypeName = async () => {
              try {
                  const lastSelectedType = selectedTypes[selectedTypes.length - 1];
                  const response = await api.get(`/type/${lastSelectedType}`);
                  setFilteredList(response.data.pokemon);
              } catch (error) {
                  console.log(error);
              }
          };
  
          fetchPokemonTypeName();
      }, [selectedTypes]); */







  useEffect(() => {
    const fetchPokemonList = async () => {
      setLoading(true);

      try {
        const response = await api.get(`/pokemon?limit=${PAGE_SIZE}&offset=${offset}`);
        setPokemonCount(response.data.count);

        const results: PokemonType[] = response.data.results;

        const formattedPokemonList: PokemonTypeProps[] = await Promise.all(
          results.map(async (pokemon: PokemonType) => {
            const response = await api.get(`/pokemon/${pokemon.name}`);
            const data = response.data;
            const formattedPokemon: PokemonTypeProps = {
              name: data.name,
              attack: data.stats[1].base_stat,
              defense: data.stats[2].base_stat,
              types: data.types.map((type: { type: { name: string } } & PokemonType) => type.type.name),
              image: data.sprites.other['official-artwork'].front_default,
              onClick: () => handlePokemonClick(formattedPokemon),
              hp: data.stats[0].base_stat,
              spAttack: data.stats[3].base_stat,
              spDefense: data.stats[4].base_stat,
              experience: data.base_experience,
              generation: data.game_indices[0].version.url.split('/').slice(-2, -1)[0],
              index: data.id,
              abilities: data.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),

            };
            return formattedPokemon;
          })
        );

        if (offset === 0) {
          setPokemonList(formattedPokemonList);
        } else {
          setPokemonList((prevList) => [...prevList, ...formattedPokemonList]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching Pokemon list:', error);
      }
    };

    fetchPokemonList();
  }, [offset]);


  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + PAGE_SIZE);
  };

  const handlePokemonClick = (pokemon: PokemonTypeProps) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {

    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <section className={styles.section_container}>
        <main className={styles.pokedex_container}>
          <h1 className={styles.pokemon_quantity}>
            {pokemonCount} <strong>Pokemons</strong> for you to choose your favorite
          </h1>

          <input className={styles.input} type="text" value={searchValue} onChange={handleInputChange} placeholder="Encontre o seu pokemon" />

          <div className={styles.filter_section}>
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Tipo
              </MenuButton>
              <MenuList maxHeight="15rem" overflowY="scroll">
                {pokemonTypes.map((type) => (
                  <MenuItem key={type.name}>
                    <Checkbox
                    /*                 isChecked={selectedTypes.includes(type.name)}
                                    onChange={() => handleTypeSelect(type.name)} */
                    >
                      {type.name}
                    </Checkbox>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>

          <SimpleGrid columns={[1, null, 2, 3]} spacing={[0, null, '34px']}>
            {searchValue === '' ? (
              pokemonList.map((pokemon: PokemonTypeProps, index: number) => (
                <CardPokemon key={index} {...pokemon} onClick={() => handlePokemonClick(pokemon)} />
              ))
            ) : (
              pokemonSearchList.map((pokemon: PokemonTypeProps, index: number) => (
                <CardPokemon key={index} {...pokemon} onClick={() => handlePokemonClick(pokemon)} />
              ))
            )}
          </SimpleGrid>

          {searchValue !== '' ? (<></>) : !loading && pokemonList.length < pokemonCount && (
            <Button onClick={handleLoadMore} my="4" >
              Load More
            </Button>
          )}

          {loading && <CircularProgress my="4" isIndeterminate color='yellow.300' />}


        </main>
      </section>

      <Modal size={'xl'} isCentered isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent className={styles.modal}>
          <ModalCloseButton className={styles.modal_close} />

          {selectedPokemon && (
            <>

              <ModalBody className={selectedPokemon.types.includes('grass') || selectedPokemon.types.includes('bug') ? styles.modal_body_green :
                selectedPokemon.types.includes('grass') || selectedPokemon.types.includes('dark') || selectedPokemon.types.includes('rock') ? styles.modal_body_container_gray :
                  selectedPokemon.types.includes('ice') || selectedPokemon.types.includes('water') ? styles.modal_body_container_blue :
                    selectedPokemon.types.includes('fire') || selectedPokemon.types.includes('fighting') || selectedPokemon.types.includes('dragon') ? styles.modal_body_container_red :
                      selectedPokemon.types.includes('normal') || selectedPokemon.types.includes('gosth') ? styles.modal_body_container_light_blue :
                        selectedPokemon.types.includes('poison') || selectedPokemon.types.includes('psychic') || selectedPokemon.types.includes('fairy') || selectedPokemon.types.includes('ghost') ? styles.modal_body_container_purple :
                          selectedPokemon.types.includes('ground') ? styles.modal_body_container_brown :
                            styles.modal_body_container_yellow} py={0} px={0}>

                <section className={styles.modal_container}>


                  <article className={selectedPokemon.types.includes('grass') || selectedPokemon.types.includes('bug') ? styles.modal_image_container_green :
                    selectedPokemon.types.includes('grass') || selectedPokemon.types.includes('dark') || selectedPokemon.types.includes('rock') ? styles.modal_image_container_gray :
                      selectedPokemon.types.includes('ice') || selectedPokemon.types.includes('water') ? styles.modal_image_container_blue :
                        selectedPokemon.types.includes('fire') || selectedPokemon.types.includes('fighting') || selectedPokemon.types.includes('dragon') ? styles.modal_image_container_red :
                          selectedPokemon.types.includes('normal') || selectedPokemon.types.includes('gosth') ? styles.modal_image_container_light_blue :
                            selectedPokemon.types.includes('poison') || selectedPokemon.types.includes('psychic') || selectedPokemon.types.includes('fairy') || selectedPokemon.types.includes('ghost') ? styles.modal_image_container_purple :
                              selectedPokemon.types.includes('ground') ? styles.modal_image_container_brown :
                                styles.modal_image_container_yellow}>
                    <img className={styles.modal_image} src={selectedPokemon.image} alt={selectedPokemon.name} />
                    <article className={styles.types_container}>
                      {selectedPokemon.types.map((type, index) => (
                        <Badge key={index} type={[type]} />
                      ))}
                    </article>
                  </article>

                  <article className={styles.modal_information_container}>
                    <article className={styles.information_header}>
                      <h2 className={styles.modal_header}>{selectedPokemon.name}</h2>
                      <article className={styles.generation_container}>
                        <span className={styles.generation}>Generation {selectedPokemon.generation}</span>
                        <div className={styles.index_container}>
                          <span>
                            {selectedPokemon.index}
                          </span>
                        </div>
                      </article>
                    </article>

                    <article className={styles.container_abilities}>
                      <span className={styles.abilities_title}>Abilities</span>
                      <span>{selectedPokemon.abilities && selectedPokemon.abilities.join(" - ")}</span>
                    </article>

                    <article className={styles.container_base_stats}>
                      <article className={styles.base_stats}>
                        <span>Hp</span>
                        <span><strong>{selectedPokemon.hp}</strong></span>
                        <Progress className={styles.progress_bar} colorScheme='green' value={selectedPokemon.hp} />
                      </article>
                      <article className={styles.base_stats}>
                        <span>Experience</span>
                        <span> <strong> {selectedPokemon.experience} </strong></span>
                        <Progress className={styles.progress_bar} colorScheme='yellow' value={selectedPokemon.experience} />
                      </article>
                    </article>

                    <div className={styles.stats_cards_container}>

                      <article className={styles.stats_container}>
                        <div className={styles.black_circle}>
                          <span>{selectedPokemon.defense}</span>
                        </div>
                        <p>Defense</p>

                      </article>
                      <article className={styles.stats_container}>
                        <div className={styles.black_circle}>
                          <span>{selectedPokemon.attack}</span>
                        </div>
                        <p>Attack</p>
                      </article>
                      <article className={styles.stats_container}>
                        <div className={styles.black_circle}>
                          <span>{selectedPokemon.spDefense}</span>
                        </div>
                        <p>SpDefense</p>
                      </article>
                      <article className={styles.stats_container}>
                        <div className={styles.black_circle}>
                          <span>{selectedPokemon.spAttack}</span>
                        </div>
                        <p>spAttack</p>
                      </article>

                    </div>

                  </article>

                </section>


              </ModalBody>
            </>
          )}

        </ModalContent>
      </Modal>

    </>
  );
};