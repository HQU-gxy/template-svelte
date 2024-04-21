import "./app.pcss"
import App from "./App.svelte"
import { mount } from "svelte"

// https://svelte-5-preview.vercel.app/docs/breaking-changes#components-are-no-longer-classes
// @ts-expect-error
const app = mount(App, { target: document.getElementById("app")! })

export default app
