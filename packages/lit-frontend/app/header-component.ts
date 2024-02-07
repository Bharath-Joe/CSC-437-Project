import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("header-component")
class HeaderElement extends LitElement {

    render() {
        return html`            
            <header class="Website-Header">
                <section>
                    <svg class="icon">
                        <use href="/icons/icons.svg#logo" />
                    </svg>
                    <h1>Meal Maker</h1>
                </section>
                <drop-down>
                    <section class="User-Drop-Down">
                        <svg class="user">
                            <use href="/icons/icons.svg#batman" />
                        </svg>
                        <p>Hello, Bharath</p>
                    </section>
                    <ul slot="menu">
                        <li><toggle-switch id="toggle">Lights</toggle-switch></li>
                        <li>
                            <svg class="icon">
                                <use href="/icons/icons.svg#user" />
                            </svg>
                            My Profile
                        </li>
                        <li>
                            <svg class="icon">
                                <use href="/icons/icons.svg#edit-user" />
                            </svg>
                            Edit Profile
                        </li>
                        <li>
                            <svg class="icon">
                                <use href="/icons/icons.svg#help" />
                            </svg>
                            Help
                        </li>
                        <li>
                            <svg class="icon">
                                <use href="/icons/icons.svg#logout" />
                            </svg>
                            Logout
                        </li>
                    </ul>
                </drop-down>
            </header>`;
    }

    static styles = css`

    * {
        margin: 0;
        box-sizing: border-box;
    }

    h1 {
        font-family: var(--font-family-header);
    }

    .Website-Header {
        font-size: 19px;
        display: flex;
        align-items: center;
        padding: 15px 50px 15px 50px;
        color: var(--color-text-heading);
        border-bottom: 2px solid var(--color-text-heading);
        justify-content: space-between;
    }

    .Website-Header section {
        display: flex;
        gap: 0.5rem;
    }
    
    .User-Drop-Down {
        align-items: center;
    }
    
    drop-down li {
        display: flex;
        font-size: var(--size-spacing-medium);
        margin: 15px;
        align-items: center;
        gap: 10px;
    }
    
    .user {
        border: 1px solid;
        border-radius: 50%;
        padding: 3px;
        height: 2em;
        width: 2em;
        vertical-align: top;
        fill: currentColor;
    }

    svg.icon {
        display: inline;
        height: 1.5em;
        width: 1.5em;
        vertical-align: top;
        fill: currentColor;
    }
    `;
}