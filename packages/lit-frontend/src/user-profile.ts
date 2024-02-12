import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Profile } from "../../express-backend/src/models/profile";
import { serverPath } from "./rest";

@customElement("user-profile")
export class UserProfileElement extends LitElement {
    @property()
    path: string = "";

    @state()
    profile?: Profile;

    render() {
        return html`
            <section>
                <label><b>Name</b><span>${this.profile?.name}</span></label>
                <label
                    ><b>Nickname</b
                    ><span>${this.profile?.nickname}</span></label
                >
                <label><b>UserID</b><span>${this.profile?.userid}</span></label>
                <label
                    ><b>Preferred Cuisine</b
                    ><span>${this.profile?.preferredCuisine}</span></label
                >
                <label
                    ><b>Favorite Meal</b
                    ><span>${this.profile?.favoriteMeal}</span></label
                >
                <label
                    ><b>Cooking Skill Level</b
                    ><span>${this.profile?.cookingSkillLevel}</span></label
                >
            </section>
        `;
    }

    static styles = css`
        section {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        label {
            display: flex;
            flex-direction: column;
        }

        b {
            color: var(--color-text);
            margin-bottom: 5px;
        }

        span {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            color: var(--color-text);
        }

        button {
            margin-top: 10px;
        }
    `;

    connectedCallback() {
        if (this.path) {
            this._fetchData(this.path);
        }
        super.connectedCallback();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "path" && oldValue !== newValue && oldValue) {
            this._fetchData(newValue);
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }

    _fetchData(path: string) {
        fetch(serverPath(path))
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return null;
            })
            .then((json: unknown) => {
                if (json) {
                    this.profile = json as Profile;
                    this.requestUpdate(); // Ensure LitElement updates the view
                }
            });
    }
}

@customElement("user-profile-edit")
export class UserProfileEditElement extends UserProfileElement {
    render() {
        console.log("Rendering form", this.profile);
        return html`
            <form @submit=${this._handleSubmit}>
                <label>
                    <span>Name</span>
                    <input name="name" value="${this.profile?.name}" />
                </label>
                <label>
                    <span>Nickname</span>
                    <input name="nickname" value="${this.profile?.nickname}" />
                </label>
                <label>
                    <span>UserId</span>
                    <input name="userid" value="${this.profile?.userid}" />
                </label>
                <label>
                    <span>Preferred Cuisine</span>
                    <input
                        name="preferredCuisine"
                        value="${this.profile?.preferredCuisine}"
                    />
                </label>
                <label>
                    <span>Favorite Meal</span>
                    <input
                        name="favoriteMeal"
                        value="${this.profile?.favoriteMeal}"
                    />
                </label>
                <label>
                    <span>Cooking Skill Level</span>
                    <input
                        name="cookingSkillLevel"
                        value="${this.profile?.cookingSkillLevel}"
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        `;
    }

    // static styles = [...UserProfileElement.styles, css`...`];
    static styles = css`
        form {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        label {
            display: flex;
            flex-direction: column;
        }

        span {
            color: var(--color-text);
            margin-bottom: 5px;
            font-weight: bold;
        }

        input {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        button {
            margin-top: 10px;
            padding: 10px 0px 10px 0px;
            border-radius: 4px;
        }
    `;

    _handleSubmit(ev: Event) {
        ev.preventDefault();

        const target = ev.target as HTMLFormElement;
        const formdata = new FormData(target);
        const entries = Array.from(formdata.entries()).map(([k, v]) =>
            v === "" ? [k] : [k, v]
        );
        const json = Object.fromEntries(entries);
        console.log(json);

        this._putData(json);
    }

    _putData(json: Profile) {
        console.log(this.path);
        fetch(serverPath(this.path), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json),
        })
            .then((response) => {
                if (response.status === 200) return response.json();
                else return null;
            })
            .then((json: unknown) => {
                if (json) this.profile = json as Profile;
            })
            .catch((err) => console.log("Failed to PUT form data", err));
    }
}
