import type { CopySection } from "@/lib/copy/types";

export const errorsCopy = {
    id: "errors",
    title: "Error pages (404, something went wrong)",
    fields: [
        // 404 page (any address that doesn't exist)
        { key: "notFoundSeoTitle", label: "404 page: browser tab title", default: "Page not found" },
        { key: "notFoundCode", label: "404 page: small line above the title", default: "404" },
        { key: "notFoundTitle", label: "404 page: title", default: "Page not found" },
        { key: "notFoundText", label: "404 page: text", type: "textarea", default: "The page you're looking for doesn't exist, or its address has changed." },
        { key: "notFoundHome", label: "404 page: go home button", default: "Go home" },
        { key: "notFoundBack", label: "404 page: go back button", default: "Go back" },

        // Error page (shown when a page crashes)
        { key: "errorTitle", label: "Error page: title", default: "Something went wrong" },
        { key: "errorText", label: "Error page: text", type: "textarea", default: "We ran into a problem while loading this page. Please try again." },
        { key: "errorUnknown", label: "Error page: shown when the error has no details", default: "Unknown error" },
        { key: "errorHome", label: "Error page: go home button", default: "Go home" },
        { key: "errorRetry", label: "Error page: try again button", default: "Try again" },
    ],
} as const satisfies CopySection;
