import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createContext, provide } from "@lit/context";
import resetCSS from "../styles/reset.css?inline";
import pageCSS from "../styles/page.css?inline";
import { APIUser, AuthenticatedUser, FormDataRequest } from "../rest";

export let authContext = createContext<APIUser>("auth");

@customElement("login-page")
class LoginElement extends LitElement {
    @state()
    isLogin: boolean = true;

    toggleLogin(isLogin: boolean) {
        this.isLogin = isLogin;
    }

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
                window.location.href = "/app";
            });
    }

    @provide({ context: authContext })
    @state()
    user: APIUser = AuthenticatedUser.authenticateFromLocalStorage(() =>
        this.signOut()
    );

    @state()
    loginStatus: number = 0;

    isAuthenticated() {
        return this.user.authenticated;
    }

    firstUpdated() {
        this.toggleDialog(!this.isAuthenticated());
        if (this.isAuthenticated()) {
            this.dispatchUserLoggedIn(this.user as AuthenticatedUser);
        }
    }

    handleLogin(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const data = new FormData(form);
        const request = new FormDataRequest(data);

        request
            .base()
            .post("/login")
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    this.loginStatus = res.status;
                }
            })
            .then((json) => {
                if (json) {
                    console.log("Authentication:", json.token);
                    const authenticatedUser = AuthenticatedUser.authenticate(
                        json.token,
                        () => this.signOut()
                    );
                    this.user = authenticatedUser;
                    console.log(this.user);
                    this.toggleDialog(false);
                    this.dispatchUserLoggedIn(
                        authenticatedUser as AuthenticatedUser
                    );
                }
            });
    }

    signOut() {
        this.user = APIUser.deauthenticate(this.user);
        console.log("SIGN OUT", this.user);
        this.toggleDialog(!this.isAuthenticated());
        document.location.reload();
    }

    dispatchUserLoggedIn(user: AuthenticatedUser) {
        const userLoggedIn = new CustomEvent("mvu:message", {
            bubbles: true,
            composed: true,
            detail: {
                type: "UserLoggedIn",
                user,
            },
        });
        this.dispatchEvent(userLoggedIn);
    }

    toggleDialog(open: boolean) {
        const dialog = this.shadowRoot?.querySelector(
            "dialog"
        ) as HTMLDialogElement | null;
        if (dialog) {
            if (open) {
                console.log("Showing dialog");
                dialog.showModal();
            } else {
                console.log("Closing dialog");
                dialog.close();
            }
        }
    }

    render() {
        const dialog = html`
            ${this.isLogin
                ? html`<section class="login-container">
                      <form
                          @submit=${this.handleLogin}
                          @change=${() => (this.loginStatus = 0)}
                      >
                          <h1>Login</h1>
                          <label
                              ><span>Username:</span> <input name="username"
                          /></label>
                          <label
                              ><span>Password:</span>
                              <input name="password" type="password"
                          /></label>
                          <button type="submit">Login</button>
                          <a href="#" @click=${() => this.toggleLogin(false)}
                              >Don't have an account? Register</a
                          >

                          <p>
                              ${this.loginStatus
                                  ? `Login failed: ${this.loginStatus}`
                                  : ""}
                          </p>
                      </form>
                  </section>`
                : html` <section class="login-container">
                      <form
                          @submit=${this.handleSignUp}
                          @change=${(this.registerStatus = 0)}
                      >
                          <h1>Sign Up</h1>
                          <label
                              ><span>Full Name:</span> <input name="name"
                          /></label>
                          <label
                              ><span>Preferred Cuisine:</span>
                              <input name="preferredCuisine"
                          /></label>
                          <label
                              ><span>Favorite Meal:</span>
                              <input name="favoriteMeal"
                          /></label>
                          <label
                              ><span>Create Username:</span>
                              <input name="username"
                          /></label>
                          <label
                              ><span>Create Password:</span>
                              <input name="password" type="password"
                          /></label>
                          <button type="submit">Sign Up</button>
                          <a href="#" @click=${() => this.toggleLogin(true)}
                              >Already have an account? Login
                          </a>
                          <p>
                              ${this.registerStatus
                                  ? `Signup failed: ${this.registerStatus}`
                                  : ""}
                          </p>
                      </form>
                  </section>`}
        `;
        return html`
            ${this.isAuthenticated() ? "" : dialog}
            <slot></slot>
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
