import { definePanel } from "@directus/extensions-sdk";
import PanelComponent from "./panel.vue";

export default definePanel({
  id: "directus-extension-environment-lock",
  name: "Environment Lock",
  icon: "shield_lock",
  description:
    "This extension locks the environment to prevent changes to the schema and settings.",
  component: PanelComponent,
  options: [],
  minWidth: 12,
  minHeight: 8,
});
