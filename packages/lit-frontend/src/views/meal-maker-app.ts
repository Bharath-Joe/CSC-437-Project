import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
// MVU app
import * as App from "../app";
import routes from "../routes";
import update from "../update";
// Components
import "../components/header-component";
import "../components/vaadin-router";
import "./login-page";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";

@customElement("meal-maker-app")
class MealMakerElement extends App.Main {
    constructor() {
        super(update);
    }

    includeHeader = !["/login", "/register"].includes(window.location.pathname);
    
    render() {
        return html`
            <section id="Body">
                ${this.includeHeader
                    ? html`<header-component></header-component>`
                    : ""} <vaadin-router .routes=${routes}> </vaadin-router>
            </section>
        `;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            :host {
                display: contents;
            }

            vaadin-router {
                display: flex;
                width: 100%;
                justify-content: center;
            }
        `,
    ];
}
