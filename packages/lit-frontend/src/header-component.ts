import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("header-component")
class HeaderElement extends LitElement {
    render() {
        return html` <header class="Website-Side-Header">
            <section class="Website-Title">
                <h1>MealMaker</h1>
            </section>
            <section class="Side-Header-Contents">
                <ul>
                    <li>Recipies</li>
                    <li>Favorites</li>
                    <li>Filters</li>
                    <li>Create</li>
                </ul>
            </section>
            <section>
                <ul>
                    <li>Settings</li>
                    <li>Log Out</li>
                </ul>
            </section>
        </header>`;
    }

    static styles = css`
        * {
            margin: 0;
            box-sizing: border-box;
        }

        h1 {
            font-family: var(--font-family-header);
            font-size: 
        }

        .Website-Side-Header {
            padding: 40px 50px 40px 50px;
            display: flex;
            color: white;
            // border: 1px solid black;
            border-radius: 0px 30px 0px 0px;
            background-color: var(--color-background);
            width: fit-content;
            height: 100vh;
            flex-direction: column;
            justify-content: space-between;
        }
    `;
}
