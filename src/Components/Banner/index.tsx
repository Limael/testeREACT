import { Link } from 'react-router-dom'
import banner from '../../assets/banner.png'
import banner_complete from '../../assets/BannerComplete.png'
import { Footer } from '../Footer'

import styles from './index.module.css'
import { Header } from '../Header'

export const Banner = () => {
    return (
        <>
            <Header />

            <section className={styles.section_container}>
                <img className={styles.image_responsive} src={banner_complete} alt="pikachu" />

                <article className={styles.information_container}>
                    <h1 className={styles.title}>
                        <strong>Find</strong> all your
                        favorite <strong>Pokemon</strong>
                    </h1>

                    <h2 className={styles.information}>
                        You can know the type of Pokemon, its strengths, disadvantages and abilities
                    </h2>
                    <button className={styles.button}>
                        <Link to="pokedex">   See pokemons </ Link >
                    </button>

                </article>
                <img className={styles.image} src={banner} alt="pikachu" />

                <Footer />
            </section>

        </>
    )

}