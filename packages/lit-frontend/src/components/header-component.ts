import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";
import { consume } from "@lit/context";
import { authContext } from "../views/login-page";
import { APIUser } from "../rest";

interface PathToPageMap {
    [key: string]: string;
}

@customElement("header-component")
class HeaderElement extends LitElement {
    @consume({ context: authContext, subscribe: true })
    @property({ attribute: false })
    user = new APIUser();

    @property()
    currentPage = "dashboard";

    @property({ type: String })
    name: string = "";

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener("popstate", () => {
            this.updateCurrentPage();
        });
        this.updateCurrentPage();
        fetch(`http://localhost:3000/profiles/${this.user.username}`)
            .then((response) => response.json())
            .then((data) => {
                this.name = data.name;
                this.requestUpdate();
            })
            .catch((error) => console.error("Error fetching profile:", error));
    }

    updateCurrentPage() {
        const currentPath = window.location.pathname;

        const pathToPage: PathToPageMap = {
            "/": "dashboard",
            "/favorites": "favorites",
            "/filters": "filters",
            "/create": "create",
            "/settings": "settings",
        };

        this.currentPage = pathToPage[currentPath] || "dashboard";
    }

    logOut() {
        this.user.signOut();
    }

    render() {
        return html` <header class="Website-Side-Header">
            <section class="Website-Title">
                <h1>MealMaker</h1>
                <img src="../images/headshot.jpg" />
                <p>${this.name}</p>
            </section>
            <section class="Side-Header-Contents">
                <ul>
                    <li>
                        <a
                            href="/"
                            class="${this.currentPage === "dashboard"
                                ? "active"
                                : ""}"
                        >
                            <svg class="icon">
                                <use href="/icons/icons.svg#dashboard" /></svg
                            >Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href="/favorites"
                            class="${this.currentPage === "favorites"
                                ? "active"
                                : ""}"
                        >
                            <svg class="icon">
                                <use href="/icons/icons.svg#favorite" /></svg
                            >Favorites
                        </a>
                    </li>
                    <li>
                        <a
                            href="/filters"
                            class="${this.currentPage === "filters"
                                ? "active"
                                : ""}"
                        >
                            <svg class="icon">
                                <use href="/icons/icons.svg#filter" /></svg
                            >Filters
                        </a>
                    </li>
                    <li>
                        <a
                            href="/create"
                            class="${this.currentPage === "create"
                                ? "active"
                                : ""}"
                        >
                            <svg class="icon">
                                <use href="/icons/icons.svg#create" /></svg
                            >Create
                        </a>
                    </li>
                </ul>
            </section>
            <section>
                <ul>
                    <li>
                        <a
                            href="/settings"
                            class="${this.currentPage === "settings"
                                ? "active"
                                : ""}"
                        >
                            <svg class="icon">
                                <use href="/icons/icons.svg#settings" /></svg
                            >Settings
                        </a>
                    </li>
                    <li class="logout" @click=${this.logOut}>
                        <a href="/login">
                            <svg class="icon">
                                <use href="/icons/icons.svg#logout" /></svg
                            >Log Out
                        </a>
                    </li>
                </ul>
            </section>
        </header>`;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            h1 {
                font-family: var(--font-family-header);
                font-size: var(--size-spacing-large);
            }

            .Website-Title {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--size-spacing-small);
            }

            .Website-Side-Header {
                position: sticky;
                top: 0;
                z-index: 100;
                padding: 30px;
                display: flex;
                color: var(--color-text);
                border-radius: 0px 30px 0px 0px;
                background-color: var(--color-background);
                height: 100vh;
                width: 250px;
                flex-direction: column;
                justify-content: space-between;
            }

            ul {
                display: flex;
                flex-direction: column;
                list-style: none;
                gap: var(--size-spacing-small);
                margin: 0;
                padding: 0;
            }

            li a,
            .logout {
                text-decoration: none;
                color: var(--color-text);
                display: flex;
                align-items: center;
                gap: var(--size-spacing-small);
                font-size: var(--size-spacing-small);
                padding: 8px 8px 8px 8px;
            }

            .logout {
                padding: 0;
            }

            li a.active {
                background-color: var(--color-background-invert);
                color: var(--color-text-invert);
                border-radius: 10px;
            }

            img {
                border-radius: 10px;
                width: 100px;
                height: 100px;
                object-fit: cover;
                object-position: center;
                overflow: hidden;
            }
        `,
    ];
}
