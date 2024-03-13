import { PropertyValueMap, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as App from "../app";
import "../components/header-component";
import "../components/meal-card";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";
import { consume } from "@lit/context";
import { authContext } from "./login-page";
import { APIUser } from "../rest";
import { Profile } from "ts-models";

@customElement("settings-page")
class SettingsPageElement extends App.View {
    @consume({ context: authContext, subscribe: true })
    @property({ attribute: false })
    user = new APIUser();

    @property({ type: Object })
    profile: Profile = {
        userid: "",
        name: "",
        preferredCuisine: "",
        favoriteMeal: "",
        favorites: [],
    };

    favoritesCount = 0;

    connectedCallback() {
        super.connectedCallback();
        // this.fetchProfile();
    }

    protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
        if(_changedProperties.has("user")) {
            this.fetchProfile();
        }
    }

    fetchProfile() {
        fetch(`http://localhost:3000/profiles/${this.user.username}`)
            .then((response) => response.json())
            .then((data) => {
                this.profile.name = data.name;
                this.profile.userid = data.userid;
                this.profile.favoriteMeal = data.favoriteMeal;
                this.profile.preferredCuisine = data.preferredCuisine;
                this.favoritesCount = data.favorites.length;

                this.requestUpdate();
            })
            .catch((error) => console.error("Error fetching profile:", error));
    }

    render() {
        return html`
            <section class="body-content">
                <section class="profile-outline">
                    <section class="profile-header">
                        <img src="../images/headshot.jpg" />
                        <p class="username">@${this.profile.userid}</p>
                    </section>
                    <section class="profile-stats">
                        <section>
                            <p class="value">${this.favoritesCount}</p>
                            <b>Favorites</b>
                        </section>
                        <section>
                            <p class="value">2</p>
                            <b>Created</b>
                        </section>
                    </section>
                    <section class="profile-details">
                        <section class="headers">
                            <b>Name</b>
                            <b>Preferred Cuisine</b>
                            <b>Favorite Meal</b>
                        </section>
                        <section class="values">
                            <p>${this.profile.name}</p>
                            <p>${this.profile.preferredCuisine}</p>
                            <p>${this.profile.favoriteMeal}</p>
                        </section>
                        <section class="edit">
                            <svg class="icon">
                                <use href="/icons/icons.svg#edit" />
                            </svg>
                            <svg class="icon">
                                <use href="/icons/icons.svg#edit" />
                            </svg>
                            <svg class="icon">
                                <use href="/icons/icons.svg#edit" />
                            </svg>
                        </section>
                    </section>
                    <toggle-switch id="toggle">Theme</toggle-switch>
                </section>
            </section>
        `;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            #toggle {
                margin-top: var(--size-spacing-large);
            }
            .icon {
                color: var(--color-background);
                fill: none;
                cursor: pointer;
            }
            .body-content {
                width: 100%;
                padding: 40px;
                color: var(--color-body-text);
            }

            .profile-header {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .username {
                margin-top: var(--size-spacing-extra-small);
                font-size: 13px;
                font-weight: 300;
            }

            img {
                border-radius: 10px;
                width: 150px;
                height: 150px;
                object-fit: cover;
                object-position: center;
                overflow: hidden;
            }

            .profile-outline {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .headers {
                display: flex;
                flex-direction: column;
                gap: var(--size-spacing-large);
                justify-content: space-between;
            }

            .values,
            .edit {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-weight: 300;
            }

            .profile-details {
                display: flex;
                gap: var(--size-spacing-large);
                margin-top: var(--size-spacing-large);
            }

            .profile-stats {
                margin-top: var(--size-spacing-large);
                display: flex;
                gap: var(--size-spacing-medium);
            }

            .profile-stats section {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--size-spacing-extra-small);
                border: 2px solid var(--color-border);
                border-radius: 10px;
                padding: 10px;
            }

            .profile-stats section .value {
                font-weight: 300;
            }
        `,
    ];
}
