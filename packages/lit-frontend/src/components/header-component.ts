import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";

@customElement("header-component")
class HeaderElement extends LitElement {
    @property()
    currentPage = "dashboard";

    handleNavigation(page: string) {
        this.currentPage = page;
    }

    render() {
        return html` <header class="Website-Side-Header">
            <section class="Website-Title">
                <h1>MealMaker</h1>
                <img src="../images/headshot.jpg" />
                <p>Bharath Senthilkumar</p>
            </section>
            <section class="Side-Header-Contents">
                <ul>
                    <li>
                        <a href="/">
                            <svg class="icon">
                                <use href="/icons/icons.svg#dashboard" /></svg
                            >Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="favorites">
                            <svg class="icon">
                                <use href="/icons/icons.svg#favorite" /></svg
                            >Favorites
                        </a>
                    </li>
                    <li>
                        <a href="filters">
                            <svg class="icon">
                                <use href="/icons/icons.svg#filter" /></svg
                            >Filters
                        </a>
                    </li>
                    <li>
                        <a href="create">
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
                        <a href="settings">
                            <svg class="icon">
                                <use href="/icons/icons.svg#settings" /></svg
                            >Settings
                        </a>
                    </li>
                    <li class="logout">
                        <svg class="icon">
                            <use href="/icons/icons.svg#logout" /></svg
                        >Log Out
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

            li a.active {
                background-color: var(--color-background-invert);
                color: var(--color-text-invert);
                border-radius: 10px;
            }

            img {
                border-radius: 50%;
                width: 100px;
                height: 100px;
                object-fit: cover;
                object-position: center;
                overflow: hidden;
            }
        `,
    ];
}
