import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";
import { FormDataRequest } from "../rest";

@customElement("register-page")
class RegisterElement extends LitElement {
    @state()
    registerStatus: number = 0;

    handleSignUp(event: SubmitEvent) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const request = new FormDataRequest(data);

        request
            .base()
            .post("/register")
            .then((res) => {
                if (res.status === 201) {
                    return res.json();
                } else {
                    this.registerStatus = res.status;
                }
            })
            .then((json) => {
                console.log("Registration:", json);
            });
    }

    render() {
        return html`
            <section class="login-container">
                <form
                    @submit=${this.handleSignUp}
                    @change=${(this.registerStatus = 0)}
                >
                    <h1>Sign Up</h1>
                    <label
                        ><span>Create Username:</span> <input name="username"
                    /></label>
                    <label
                        ><span>Create Password:</span>
                        <input name="password" type="password"
                    /></label>
                    <button type="submit">Sign Up</button>
                    <a href="/login">Already have an account? Login </a>
                    <p>
                        ${this.registerStatus
                            ? `Signup failed: ${this.registerStatus}`
                            : ""}
                    </p>
                </form>
            </section>
        `;
    }

    static styles = [
        unsafeCSS(resetCSS),
        unsafeCSS(pageCSS),
        css`
            h1 {
                font-size: 2rem;
            }
            .login-container {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: var(--color-background);
                width: 100vw;
            }

            form {
                display: flex;
                flex-direction: column;
                align-items: center;
                border: 1px solid var(--color-background-invert);
                padding: 25px;
                color: var(--color-text);
                border-radius: 10px;
                gap: 1rem;
                width: 35vw;
            }

            form label {
                display: flex;
                flex-direction: column;
                gap: var(--size-spacing-extra-small);
            }

            input {
                font-size: 15px;
                font-family: var(--font-family-body);
                background: none;
                border: 1px solid var(--color-background-invert);
                padding: 10px;
                color: var(--color-text);
                border-radius: 10px;
                width: 20vw;
            }

            button {
                font-size: 15px;
                color: var(--color-background);
                font-family: var(--font-family-body);
                background: var(--color-background-invert);
                border: 1px solid var(--color-border);
                padding: 10px;
                border-radius: 10px;
                width: 20vw;
            }

            a {
                text-decoration: none;
                color: var(--color-text);
                font-size: 12px;
            }
        `,
    ];
}
