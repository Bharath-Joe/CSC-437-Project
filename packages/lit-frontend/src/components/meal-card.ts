import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";

@customElement("meal-card")
class MealElement extends LitElement {
    @property({ type: String })
    src: string = "";

    @property({ type: String })
    name: string = "";

    render() {
        return html`
            <li class="card">
                <a class="card-contents" href="/app/${this.name}">
                    <section class="card-header">
                        ${this.name}
                        <svg class="icon">
                            <use href="/icons/icons.svg#favorite" />
                        </svg>
                    </section>
                    <section class="card-body">
                        <img src=${this.src} />
                    </section>
                </a>
            </li>
        `;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            img {
                width: 275px;
                height: 275px;
                border-radius: 10px;
                overflow: hidden;
                object-fit: cover;
            }
            .card {
                padding: 15px;
                // border: 2px solid var(--color-border);
                border-radius: 10px;
                color: var(--color-body-text);
                font-family: var(--font-family-header);
                width: 300px;
                box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
            }
            .card-contents {
                display: flex;
                flex-direction: column;
                gap: var(--size-spacing-large);
                text-decoration: none;
                color: var(--color-body-text);
            }

            .card-header {
                display: flex;
                align-items: baseline;
                justify-content: space-between;
                gap: var(--size-spacing-medium);
                font-size: 1.5rem;
                font-weight: bold;
                height: 50px;
            }

            .card-body {
                display: flex;
                justify-content: center;
            }

            svg.icon {
                fill: var(--color-background);
                stroke: var(--color-background);
            }
        `,
    ];
}
