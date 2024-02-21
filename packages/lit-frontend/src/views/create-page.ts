import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import "../components/meal-card";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";

@customElement("create-page")
class CreatePageElement extends App.View {
    render() {
        return html`
            <section class="body-content">
                <ul>
                    <meal-card src="../images/Spaghetti-Bolognese.webp"
                        >Spaghetti Bolognese</meal-card
                    >
                    <meal-card src="../images/sushi.jpg"
                        >Sushi Roll Combo</meal-card
                    >
                    <meal-card
                        src="../images/beef-and-broccoli-stir-fry-14.webp"
                        >Beef and Broccoli Stir-Fry</meal-card
                    >
                    <meal-card>Margherita Pizza</meal-card>
                    <meal-card>Shrimp Pad Thai</meal-card>
                    <meal-card>Chicken Tikka Masala</meal-card>
                    <meal-card>Vegetarian Enchiladas</meal-card>
                    <meal-card>Salmon Teriyaki Bowl</meal-card>
                    <meal-card>Caprese Salad</meal-card>
                    <meal-card>Butter Chicken</meal-card>
                    <meal-card>Greek Souvlaki with Tzatziki</meal-card>
                    <meal-card>Black Bean and Corn Quesadillas</meal-card>
                    <meal-card>Vegetable Curry with Basmati Rice</meal-card>
                    <meal-card>Beef Tacos with Fresh Salsa</meal-card>
                    <meal-card>Salmon and Quinoa Stuffed Peppers</meal-card>
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

            .name-refresh {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: var(--size-spacing-large);
            }

            .sort-options {
                margin-top: var(--size-spacing-small);
                margin-bottom: var(--size-spacing-large);
                width: max-content;
                border-radius: 10px;
                display: flex;
                border: 2px solid var(--color-border);
            }

            #Random {
                padding: 10px;
                border-right: 2px solid var(--color-border);
                color: var(--color-text);
                border-radius: 8px 0 0 8px;
                background-color: var(--color-background);
                color: var(--color-text);
            }

            #A-Z {
                padding: 10px;
                border-right: 2px solid var(--color-border);
                /* background-color: var(--color-background);
            color: var(--color-text); */
            }

            #Z-A {
                padding: 10px;
                /* color: var(--color-text);
            border-radius: 0 8px 8px 0;
            background-color: var(--color-background); */
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
