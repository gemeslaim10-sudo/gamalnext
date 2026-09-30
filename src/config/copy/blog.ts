import type { CopySection } from "@/lib/copy/types";

export const blogCopy = {
    id: "blog",
    title: "Blog (list, article page, comments, likes)",
    description: "Also the edit-article page, member profile pages (/users/…) and the full-screen image viewer.",
    fields: [
        // Blog page (/articles)
        { key: "title", label: "Blog page: title", default: "Blog" },
        {
            key: "description",
            label: "Blog page: text under the title",
            type: "textarea",
            default: "The latest in programming and artificial intelligence.",
        },
        { key: "writeButton", label: "Blog page: write an article button", default: "Write an article" },
        { key: "empty", label: "Blog page: message when there are no articles", default: "No articles yet." },
        { key: "editTooltip", label: "Blog page: tooltip of the edit button on your own articles", default: "Edit article" },
        { key: "deleteTooltip", label: "Blog page: tooltip of the delete button on your own articles", default: "Delete article" },
        {
            key: "deleteConfirm",
            label: "Confirmation before deleting an article",
            type: "textarea",
            default: "Are you sure you want to delete this article? This action cannot be undone.",
        },
        { key: "deleting", label: "Toast: deleting an article", default: "Deleting article…" },
        { key: "deleted", label: "Toast: article deleted", default: "Article deleted successfully!" },
        { key: "deleteFailed", label: "Toast: deleting an article failed", default: "Failed to delete article" },

        // Article page (/articles/…)
        { key: "notFoundTitle", label: "Google title when an article doesn't exist", default: "Article not found" },
        { key: "backToBlog", label: "Article page: back link", default: "Back to blog" },
        { key: "dateUnknown", label: "Article page: shown instead of the date when it's unknown", default: "Recently" },
        { key: "share", label: "Article page: Share button", default: "Share" },
        { key: "edit", label: "Article page: Edit button (author only)", default: "Edit" },
        { key: "delete", label: "Article page: Delete button (author only)", default: "Delete" },
        { key: "linkCopied", label: "Toast: article link copied", default: "Link copied to clipboard!" },
        { key: "copyFailed", label: "Toast: copying the article link failed", default: "Failed to copy link." },
        { key: "relatedTitle", label: "Article page: related articles heading", default: "Related articles" },
        { key: "relatedServices", label: "Article page: heading of the related services box", default: "How GTech can help" },
        { key: "viewAll", label: "Article page: View all button next to related articles", default: "View all" },

        // Edit article page (/articles/…/edit)
        { key: "editLoginTitle", label: "Edit article: title when signed out", default: "Welcome back" },
        { key: "editLoginText", label: "Edit article: text when signed out", default: "Please sign in to edit your articles." },
        { key: "backToArticle", label: "Edit article: back link", default: "Back to article" },
        { key: "editTitle", label: "Edit article: page title", default: "Edit article" },
        { key: "editDescription", label: "Edit article: text under the title", default: "Update the content of your article" },
        { key: "fieldTitle", label: "Edit article: title field label", default: "Article title" },
        { key: "fieldTitlePlaceholder", label: "Edit article: title field placeholder", default: "Article title…" },
        { key: "fieldContent", label: "Edit article: content field label", default: "Article content" },
        { key: "fieldContentPlaceholder", label: "Edit article: content field placeholder", default: "Write the article content here…" },
        { key: "fieldSummary", label: "Edit article: search description field label", default: "Search engine description (meta description)" },
        {
            key: "fieldSummaryPlaceholder",
            label: "Edit article: search description field placeholder",
            default: "A short description of the article shown in search results…",
        },
        { key: "fieldTags", label: "Edit article: tags field label", default: "Keywords (tags)" },
        { key: "fieldTagsPlaceholder", label: "Edit article: tags field placeholder", default: "Keywords separated by commas…" },
        { key: "save", label: "Edit article: save button", default: "Save changes" },
        { key: "saved", label: "Toast: article changes saved", default: "Article updated successfully!" },
        { key: "saveFailed", label: "Toast: saving the article failed", default: "Something went wrong while saving your changes." },
        { key: "editNotFound", label: "Toast: the article to edit doesn't exist", default: "Article not found." },
        { key: "editNotAllowed", label: "Toast: editing someone else's article", default: "You don't have permission to edit this article." },
        { key: "editLoadFailed", label: "Toast: the article to edit couldn't be loaded", default: "Something went wrong while loading the article." },

        // Comments (article page and feed posts)
        { key: "commentsTitle", label: "Comments: heading", default: "Comments" },
        { key: "commentPlaceholder", label: "Comments: text box placeholder", default: "Share your thoughts…" },
        { key: "commentPost", label: "Comments: post button", default: "Post" },
        { key: "commentJoinTitle", label: "Comments: sign-in prompt title", default: "Join the discussion" },
        {
            key: "commentJoinText",
            label: "Comments: sign-in prompt text",
            type: "textarea",
            default: "Sign in to share your thoughts, ask questions, and connect with the community instantly.",
        },
        { key: "commentLogin", label: "Comments: sign-in prompt button", default: "Log in" },
        { key: "commentJustNow", label: "Comments: shown instead of the date on a new comment", default: "Just now" },
        { key: "commentDeleteTooltip", label: "Comments: tooltip of the delete button", default: "Delete comment" },
        { key: "commentDeleteConfirm", label: "Comments: confirmation before deleting", default: "Delete this comment?" },
        { key: "commentDefaultName", label: "Comments: name saved for members without a display name", default: "User" },
        { key: "commentAdded", label: "Toast: comment posted", default: "Comment added successfully" },
        { key: "commentDeleted", label: "Toast: comment deleted", default: "Comment deleted" },
        { key: "commentDeleteFailed", label: "Toast: deleting a comment failed", default: "Failed to delete the comment" },
        { key: "commentLoginRequired", label: "Toast: commenting while signed out", default: "You must log in to comment" },
        {
            key: "commentNotAllowed",
            label: "Toast: comment rejected (permission)",
            default: "Sorry, you don't have permission to comment. Please log in again.",
        },
        { key: "commentFailed", label: "Toast: posting a comment failed", default: "An error occurred while posting the comment." },
        { key: "commentsLoadFailed", label: "Toast: comments couldn't be loaded", default: "Comments couldn't be loaded." },

        // Likes (article page and feed posts)
        { key: "likeLoginRequired", label: "Toast: liking while signed out", default: "You must log in to like this article" },
        { key: "likeFailed", label: "Toast: saving a like failed", default: "Update failed" },

        // Member profile page (/users/…)
        { key: "userSeoDescription", label: "Member page: Google description when the member has no bio", default: "{name}'s profile and articles on {siteName}.", hint: "{name} = member name, {siteName} = site name from Settings" },
        { key: "userNotFound", label: "Member page: message when the member doesn't exist", default: "User not found" },
        { key: "userGoHome", label: "Member page: button under the not-found message", default: "Go home" },
        { key: "userNoBio", label: "Member page: shown when the member has no bio", default: "No bio yet." },
        { key: "userJoined", label: "Member page: join date", default: "Joined {date}", hint: "{date} = month and year the member joined" },
        { key: "userJoinedUnknown", label: "Member page: shown when the join date is unknown", default: "Joined recently" },
        { key: "userDashboard", label: "Member page: dashboard button (admins, on their own page)", default: "Dashboard" },
        { key: "userCv", label: "Member page: CV button (admins, on their own page)", default: "CV" },
        { key: "userWrite", label: "Member page: write an article button (own page)", default: "Write an article" },
        { key: "userEditProfile", label: "Member page: edit profile button (own page)", default: "Edit profile" },
        { key: "userArticles", label: "Member page: published articles heading", default: "Published articles" },

        // Article media box (write page, edit article page)
        { key: "mediaTitle", label: "Article media: heading", default: "Images & videos" },
        { key: "mediaAdd", label: "Article media: add button", default: "Add media" },
        { key: "mediaUploading", label: "Article media: add button while uploading", default: "Uploading…" },
        { key: "mediaEmpty", label: "Article media: empty box", default: "No media yet. Add images or videos." },
        { key: "mediaImage", label: "Article media: label on an image", default: "Image" },
        { key: "mediaVideo", label: "Article media: label on a video", default: "Video" },
        { key: "mediaRemove", label: "Article media: remove button tooltip", default: "Remove" },
        { key: "mediaOpenFailed", label: "Article media: toast when the upload window can't open", default: "Couldn't open the upload window. Please try again." },

        // Shared
        { key: "loading", label: "Loading message (edit article, member page)", default: "Loading…" },
        { key: "viewerOpenOriginal", label: "Image viewer: tooltip of the open original button", default: "Open original" },
    ],
} as const satisfies CopySection;
