import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
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

    render() {
        return html`
            <login-page>
                <section id="Body">
                    <header-component></header-component>
                    <vaadin-router .routes=${routes}> </vaadin-router>
                </section>
            </login-page>
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
