import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("meal-card")
class MealElement extends LitElement {
    @property({ type: String })
    htmlFile: string = "";

    @property({ type: String })
    src: string = "";

    render() {
        return html`
            <li class="card">
                <a href="${this.htmlFile}" class="card-contents">
                    <img src="${this.src}" width="200" />
                    <hr width="100%" />
                    <slot></slot>
                </a>
            </li>
        `;
    }

    static styles = css`
        .card {
            border: 2px solid var(--color-border);
            border-radius: 10px;
            padding: 15px;
            color: var(--color-text);
        }
        .card:hover {
            background-color: var(--color-hover);
        }
        .card-contents {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--size-spacing-medium);
            color: var(--color-text);
            text-decoration: none;
            font-weight: bold;
        }
    `;
}
