import { isValidElement } from "react";

// ---------------------------------------------------------------------------
// Cloudstry M3 Icon Library
// Each component accepts {...props} so cloneElement(icon, { slot: "icon" })
// propagates the slot attribute to the underlying SVG element.
// ---------------------------------------------------------------------------

export function PlusIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>;
}

export function EditIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>;
}

export function DeleteIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>;
}

export function ComposeIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>;
}

export function ShareIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" /></svg>;
}

export function StarIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>;
}

export function FavoriteIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;
}

export function FavoriteBorderIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" /></svg>;
}

export function BookmarkIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>;
}

export function BookmarkBorderIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" /></svg>;
}

export function SearchIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>;
}

export function MoreVertIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>;
}

export function ArrowBackIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>;
}

export function ArrowForwardIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" /></svg>;
}

export function PlayIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M8 5v14l11-7z" /></svg>;
}

export function PauseIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
}

export function OpenInNewIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>;
}

export function CalendarIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" /></svg>;
}

export function MapIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>;
}

export function HomeIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>;
}

export function CloseIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>;
}

export function CheckIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>;
}

export function SettingsIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></svg>;
}

export function NotificationsIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>;
}

export function PersonIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>;
}

export function RefreshIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" /></svg>;
}

export function FilterIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" /></svg>;
}

export function SortIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" /></svg>;
}

export function VisibilityIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>;
}

export function VisibilityOffIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" /></svg>;
}

export function MenuIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>;
}

export function ExpandMoreIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>;
}

export function ExpandLessIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" /></svg>;
}

export function ChevronRightIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>;
}

export function ChevronLeftIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>;
}

export function CopyIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>;
}

export function LinkIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" /></svg>;
}

export function ImageIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>;
}

export function SendIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>;
}

export function AttachFileIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" /></svg>;
}

export function DownloadIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>;
}

export function UploadIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" /></svg>;
}

export function InfoIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>;
}

export function WarningIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>;
}

export function CheckCircleIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>;
}

export function FormatBoldIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" /></svg>;
}

export function FormatItalicIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" /></svg>;
}

export function FormatUnderlinedIcon(props) {
    return <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" {...props}><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" /></svg>;
}

// ---------------------------------------------------------------------------
// Registry: maps icon name strings to their components
// ---------------------------------------------------------------------------
export const iconRegistry = {
    // Add / Plus
    plusIcon: PlusIcon,
    addIcon: PlusIcon,

    // Edit / Pencil
    editIcon: EditIcon,
    pencilIcon: EditIcon,

    // Delete / Trash
    deleteIcon: DeleteIcon,
    trashIcon: DeleteIcon,

    // Compose / Email / Mail
    composeIcon: ComposeIcon,
    emailIcon: ComposeIcon,
    mailIcon: ComposeIcon,

    // Share
    shareIcon: ShareIcon,

    // Star
    starIcon: StarIcon,

    // Favorite / Heart
    favoriteIcon: FavoriteIcon,
    heartIcon: FavoriteIcon,

    // Favorite Border / Heart Outline
    favoriteBorderIcon: FavoriteBorderIcon,
    heartOutlineIcon: FavoriteBorderIcon,

    // Bookmark
    bookmarkIcon: BookmarkIcon,

    // Bookmark Border / Outline
    bookmarkBorderIcon: BookmarkBorderIcon,
    bookmarkOutlineIcon: BookmarkBorderIcon,

    // Search
    searchIcon: SearchIcon,

    // More Vert
    moreVertIcon: MoreVertIcon,

    // Arrow Back
    arrowBackIcon: ArrowBackIcon,

    // Arrow Forward
    arrowForwardIcon: ArrowForwardIcon,
    arrowIcon: ArrowForwardIcon,

    // Play
    playIcon: PlayIcon,

    // Pause
    pauseIcon: PauseIcon,

    // Open in New / External Link
    openInNewIcon: OpenInNewIcon,
    externalIcon: OpenInNewIcon,
    externalLinkIcon: OpenInNewIcon,

    // Calendar
    calendarIcon: CalendarIcon,

    // Map / Location / Place
    mapIcon: MapIcon,
    locationIcon: MapIcon,
    placeIcon: MapIcon,

    // Home
    homeIcon: HomeIcon,

    // Close / X
    closeIcon: CloseIcon,
    xIcon: CloseIcon,

    // Check / Done
    checkIcon: CheckIcon,
    doneIcon: CheckIcon,

    // Settings
    settingsIcon: SettingsIcon,
    gearIcon: SettingsIcon,

    // Notifications / Bell
    notificationsIcon: NotificationsIcon,
    bellIcon: NotificationsIcon,

    // Person / Account
    personIcon: PersonIcon,
    accountIcon: PersonIcon,

    // Refresh
    refreshIcon: RefreshIcon,

    // Filter
    filterIcon: FilterIcon,

    // Sort
    sortIcon: SortIcon,

    // Visibility / Eye
    visibilityIcon: VisibilityIcon,
    eyeIcon: VisibilityIcon,

    // Visibility Off / Eye Slash
    visibilityOffIcon: VisibilityOffIcon,
    eyeOffIcon: VisibilityOffIcon,

    // Menu / Hamburger
    menuIcon: MenuIcon,
    hamburgerIcon: MenuIcon,

    // Expand More / Chevron Down
    expandMoreIcon: ExpandMoreIcon,
    chevronDownIcon: ExpandMoreIcon,

    // Expand Less / Chevron Up
    expandLessIcon: ExpandLessIcon,
    chevronUpIcon: ExpandLessIcon,

    // Chevron Right
    chevronRightIcon: ChevronRightIcon,

    // Chevron Left
    chevronLeftIcon: ChevronLeftIcon,

    // Copy
    copyIcon: CopyIcon,

    // Link
    linkIcon: LinkIcon,

    // Image / Photo
    imageIcon: ImageIcon,
    photoIcon: ImageIcon,

    // Send
    sendIcon: SendIcon,

    // Attach File
    attachFileIcon: AttachFileIcon,
    attachIcon: AttachFileIcon,

    // Download
    downloadIcon: DownloadIcon,

    // Upload
    uploadIcon: UploadIcon,

    // Info
    infoIcon: InfoIcon,

    // Warning
    warningIcon: WarningIcon,

    // Check Circle / Success
    checkCircleIcon: CheckCircleIcon,
    successIcon: CheckCircleIcon,

    // Format Bold
    formatBoldIcon: FormatBoldIcon,

    // Format Italic
    formatItalicIcon: FormatItalicIcon,

    // Format Underlined
    formatUnderlinedIcon: FormatUnderlinedIcon,
};

// ---------------------------------------------------------------------------
// resolveIcon: converts a string name or ReactElement to a ReactElement
//
// - ReactElement: returned as-is (existing JSX icons keep working)
// - string in registry: returns <IconComponent />
// - string NOT in registry: returns null (component handles fallback)
// - null / undefined: returns null
// ---------------------------------------------------------------------------
export function resolveIcon(icon) {
    if (icon == null) return null;
    if (isValidElement(icon)) return icon;
    if (typeof icon === "string") {
        const Comp = iconRegistry[icon];
        if (Comp) return <Comp />;
    }
    return null;
}
