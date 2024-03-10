import "./views/dashboard-page";
import "./views/favorites-page";
import "./views/meal-page";
import "./views/create-page";
import "./views/filters-page";
import "./views/settings-page";

export default [
    {
        path: "/app/profile/:userid/:edit(edit)",
        component: "profile-page",
    },
    {
        path: "/app/profile/:userid",
        component: "profile-page",
    },
    { path: "/app", component: "dashboard-page" },
    { path: "/app/:mealid", component: "meal-page" },
    { path: "/create", component: "create-page" },
    { path: "/filters", component: "filters-page" },
    { path: "/settings", component: "settings-page" },
    { path: "/favorites", component: "favorites-page" },
    { path: "(.*)", redirect: "/app" },
];
