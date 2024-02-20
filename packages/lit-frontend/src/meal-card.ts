import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("meal-card")
class MealElement extends LitElement {
    @property({ type: String })
    src: string = "";

    render() {
        return html`
            <li class="card">
                <section class="card-contents">
                    <section class="card-header">
                        <slot></slot>
                        <svg class="icon">
                            <use href="/icons/icons.svg#add" />
                        </svg>
                    </section>
                    <img src="${this.src}" />
                </section>
            </li>
        `;
    }

    static styles = css`

        img {
            width: 275px;
            height: 275px;
            border-radius: 10px;
            overflow: hidden;
            object-fit: cover;
        }
        .card {
            padding: 15px;
            border: 2px solid var(--color-border);
            border-radius: 10px;
            color: var(--color-body-text);
            font-family: var(--font-family-header);
            width: 275px;
        }
        .card-contents {
            display: flex;
            flex-direction: column;
            gap: var(--size-spacing-large);
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

        svg.icon {
            display: inline;
            height: 1.5em;
            width: 1.5em;
            vertical-align: top;
            fill: var(--color-background);
            stroke: var(--color-background);
        }
    `;
}
