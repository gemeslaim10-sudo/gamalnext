import type { CopySection } from "@/lib/copy/types";

const STAT_HINT = "Leave the number empty to hide this stat.";

export const profileCopy = {
    id: "profile",
    title: "Profile page (hero, sections, reviews)",
    description:
        "The hero name, subtitle, intro and photo are edited in /admin/content, the service cards in /admin/skills, and the reviews themselves in /admin/reviews.",
    fields: [

        // Hero
        { key: "contactButton", label: "Hero: main button (opens the contact page)", default: "Contact me" },
        { key: "projectsButton", label: "Hero: second button (opens the projects page)", default: "View projects" },
        { key: "cvDownload", label: "Hero: CV button when the CV link is a PDF", default: "Download CV" },
        { key: "cvView", label: "Hero: CV button when the CV link is a web page", default: "View CV" },
        { key: "stat1Value", label: "Hero stat 1: number", default: "120+", hint: STAT_HINT },
        { key: "stat1Label", label: "Hero stat 1: label", default: "Completed projects" },
        { key: "stat2Value", label: "Hero stat 2: number", default: "98%", hint: STAT_HINT },
        { key: "stat2Label", label: "Hero stat 2: label", default: "Happy clients" },
        { key: "stat3Value", label: "Hero stat 3: number", default: "30+", hint: STAT_HINT },
        { key: "stat3Label", label: "Hero stat 3: label", default: "Technologies" },
        { key: "stat4Value", label: "Hero stat 4: number", default: "5+", hint: STAT_HINT },
        { key: "stat4Label", label: "Hero stat 4: label", default: "Years of experience" },

        // What I do (the cards are the main services from /admin/skills)
        { key: "servicesTitle", label: "What I do: section title", default: "What I do" },
        {
            key: "servicesDescription",
            label: "What I do: text under the title",
            type: "textarea",
            default: "From understanding how your business works to building and hosting the systems and websites that run it.",
            hint: "The service cards below it are the main services from /admin/skills. Leave empty to show no text.",
        },

        // Latest articles
        { key: "articlesTitle", label: "Latest articles: section title", default: "Latest articles" },
        { key: "articlesViewAll", label: "Latest articles: link to the blog", default: "View all" },

        // Reviews
        { key: "reviewsTitle", label: "Reviews: section title", default: "Client reviews" },
        {
            key: "reviewsEmpty",
            label: "Reviews: text under the title while there are no reviews yet",
            type: "textarea",
            default: "I would be happy if you share your opinion and rating about your experience with me.",
        },
        { key: "reviewFormTitle", label: "Review form: title", default: "Share your review" },
        {
            key: "reviewLoginText",
            label: "Review form: message for visitors who are not logged in",
            type: "textarea",
            default: "Log in to rate your experience and leave a review.",
        },
        { key: "reviewLoginButton", label: "Review form: log in button", default: "Log in" },
        { key: "reviewRating", label: "Review form: rating label", default: "Rating" },
        { key: "reviewComment", label: "Review form: comment label", default: "General impression and comments" },
        { key: "reviewCommentPlaceholder", label: "Review form: comment placeholder", default: "Please write your comments here..." },
        { key: "reviewCommentRequired", label: "Review form: error when the comment is empty", default: "Please write a comment before submitting." },
        { key: "reviewSubmit", label: "Review form: submit button", default: "Submit review" },
        { key: "reviewSubmitting", label: "Review form: button while sending", default: "Processing..." },
        { key: "reviewSuccess", label: "Toast: review sent and waiting for approval", default: "Review received successfully, pending approval." },
        { key: "reviewFailed", label: "Toast: sending the review failed", default: "Failed to submit review, please try again later." },
        {
            key: "reviewAnonymous",
            label: "Name saved with a review when the member has no display name",
            default: "Anonymous",
        },
    ],
} as const satisfies CopySection;
