const Icon = ({ children, size = 18, className = "", strokeWidth = 2, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

export const UserIcon = (props) => <Icon {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Icon>;
export const MailIcon = (props) => <Icon {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Icon>;
export const LockIcon = (props) => <Icon {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>;
export const EyeIcon = (props) => <Icon {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Icon>;
export const EyeOffIcon = (props) => <Icon {...props}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></Icon>;
export const LoaderIcon = (props) => <svg className={props.className || "animate-spin h-5 w-5 text-white"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>;
export const LogoIcon = (props) => <Icon {...props} size={props.size || 24}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></Icon>;
export const AlertIcon = (props) => <Icon {...props} size={props.size || 12} strokeWidth={props.strokeWidth || 2.5}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>;
export const ArrowLeftIcon = (props) => <Icon {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Icon>;
export const SaveIcon = (props) => <Icon {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></Icon>;
export const PlusIcon = (props) => <Icon {...props} strokeWidth={props.strokeWidth || 2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>;
export const LogoutIcon = (props) => <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Icon>;
export const SearchIcon = (props) => <Icon {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Icon>;
export const DocumentIcon = (props) => <Icon {...props} size={props.size || 48} strokeWidth={props.strokeWidth || 1.5}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></Icon>;
export const EditIcon = (props) => <Icon {...props} size={props.size || 14}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>;
export const TrashIcon = (props) => <Icon {...props} size={props.size || 14}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Icon>;
export const BoldIcon = (props) => <Icon {...props} size={props.size || 16} strokeWidth={props.strokeWidth || 2.5}><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></Icon>;
export const ItalicIcon = (props) => <Icon {...props} size={props.size || 16} strokeWidth={props.strokeWidth || 2.5}><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></Icon>;
export const StrikeIcon = (props) => <Icon {...props} size={props.size || 16} strokeWidth={props.strokeWidth || 2.5}><path d="M17.3 19c.58-.92.9-1.98.9-3.1a6.5 6.5 0 0 0-5.8-6.45" /><path d="M6.7 19c-.58-.92-.9-1.98-.9-3.1a6.5 6.5 0 0 1 5.8-6.45" /><line x1="12" y1="6" x2="12" y2="3" /><line x1="4" y1="14" x2="20" y2="14" /></Icon>;
export const HeadingIcon = (props) => <Icon {...props} size={props.size || 16} strokeWidth={props.strokeWidth || 2.5}><path d="M6 12h12" /><path d="M6 20V4" /><path d="M18 20V4" /></Icon>;
export const ListIcon = (props) => <Icon {...props} size={props.size || 16} strokeWidth={props.strokeWidth || 2.5}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></Icon>;
export const OrderedListIcon = (props) => <Icon {...props} size={props.size || 16} strokeWidth={props.strokeWidth || 2.5}><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></Icon>;
export const QuoteIcon = (props) => <Icon {...props} size={props.size || 16} strokeWidth={props.strokeWidth || 2.5}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 0-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 0-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></Icon>;
export const UndoIcon = (props) => <Icon {...props} size={props.size || 16} strokeWidth={props.strokeWidth || 2.5}><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></Icon>;
export const RedoIcon = (props) => <Icon {...props} size={props.size || 16} strokeWidth={props.strokeWidth || 2.5}><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" /></Icon>;
export const CalendarIcon = (props) => <Icon {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Icon>;
