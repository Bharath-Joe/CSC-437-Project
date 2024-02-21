import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import "../components/meal-card";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";

@customElement("dashboard-page")
class DashboardPageElement extends App.View {
    //Need to pull data from database
    mealData = [
        {
            name: "Spaghetti Bolognese",
            src: "../images/Spaghetti-Bolognese.webp",
        },
        { name: "Sushi Roll Combo", src: "../images/sushi.jpg" },
        {
            name: "Beef and Broccoli Stir-Fry",
            src: "../images/beef-and-broccoli-stir-fry-14.webp",
        },
        { name: "Margherita Pizza", src: "../images/margherita-pizza.jpg" },
        { name: "Shrimp Pad Thai", src: "../images/shrimp-pad-thai.jpg" },
        {
            name: "Chicken Tikka Masala",
            src: "../images/chicken-tikka-masala.jpg",
        },
        {
            name: "Vegetarian Enchiladas",
            src: "../images/vegetarian-enchiladas.jpg",
        },
        {
            name: "Salmon Teriyaki Bowl",
            src: "../images/salmon-teriyaki-bowl.jpg",
        },
        { name: "Caprese Salad", src: "../images/caprese-salad.jpg" },
        { name: "Butter Chicken", src: "../images/butter-chicken.jpg" },
        {
            name: "Greek Souvlaki with Tzatziki",
            src: "../images/greek-souvlaki.jpg",
        },
        {
            name: "Black Bean and Corn Quesadillas",
            src: "../images/black-bean-and-corn-quesadillas.jpg",
        },
        {
            name: "Vegetable Curry with Basmati Rice",
            src: "../images/vegetable-curry.jpg",
        },
        {
            name: "Beef Tacos with Fresh Salsa",
            src: "../images/beef-tacos.jpg",
        },
        {
            name: "Salmon and Quinoa Stuffed Peppers",
            src: "../images/salmon-and-quinoa-stuffed-peppers.jpg",
        },
    ];

    render() {
        return html`
            <section class="body-content">
                <section class="name-refresh">
                    <p>Hello, Bharath! What are we cooking today?</p>
                    <svg class="icon">
                        <use href="/icons/icons.svg#refresh" />
                    </svg>
                </section>
                <label class="sort">
                    Sort by:
                    <section class="sort-options">
                        <span id="Random">Random order</span>
                        <span id="A-Z">Ascending order</span>
                        <span id="Z-A">Descending order</span>
                    </section>
                </label>
                <ul>
                    ${this.mealData.map(
                        (meal) =>
                            html`<meal-card src="${meal.src}"
                                >${meal.name}</meal-card
                            >`
                    )}
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

            svg.icon {
                display: inline;
                height: 2em;
                width: 2em;
                vertical-align: top;
                fill: currentColor;
                stroke: currentColor;
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
