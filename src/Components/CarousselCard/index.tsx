import styles from './index.module.css';

import pokeball from '../../assets/pokeball.svg'

export type LegendaryCardProps = {
  image: string;
  pokemonName: string;
}

export const CarousselCard = ({ image, pokemonName }: LegendaryCardProps) => {

  return (
    <main className={styles.legendary_card}>
      <img className={styles.img} src={image} alt="Pokemon lendário" />
      <div className={styles.name_card}>
        <section className={styles.legendary_card_information}>
          <h1 className={styles.legendary_name}>{pokemonName}</h1>
          <img src={pokeball} alt="Ultra ball" />
        </section>
      </div>
    </main>

  );
};
