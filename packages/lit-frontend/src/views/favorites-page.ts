import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import "../components/meal-card";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";

@customElement("favorites-page")
class FavoritesPageElement extends App.View {
    render() {
        return html`
            <section class="body-content">
                <ul>
                    <meal-card
                        src="https://recipetineats.com/wp-content/uploads/2018/07/Spaghetti-Bolognese.jpg"
                        name="Spaghetti Bolognese"
                    ></meal-card>
                    <meal-card
                        src="https://recipetineats.com/wp-content/uploads/2018/07/Spaghetti-Bolognese.jpg"
                        name="Spaghetti Bolognese"
                    ></meal-card>
                    <meal-card
                        src="https://i.insider.com/601c27acee136f00183aa4f5?width=800&format=jpeg&auto=webp"
                        name="Spaghetti Bolognese"
                    ></meal-card>
                    <meal-card
                        src="https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2FPhoto%2FRecipe%20Ramp%20Up%2F2022-04-Pesto-Pizza%2Fpesto_pizza_4_of_4"
                        name="Pesto Pizza"
                    ></meal-card>
                    <meal-card
                    src=""
                    name="Pesto Pizza"
                ></meal-card>
                </ul>
            </section>
        `;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            .body-content {
                width: 100%;
                padding: 40px;
            }

            .body-content ul {
                padding: 0;
                margin: 0;
                display: flex;
                text-decoration: none;
                list-style: none;
                gap: var(--size-spacing-large);
                flex-wrap: wrap;
                width: fit-content;
                justify-content: space-between;
            }
        `,
    ];
}
