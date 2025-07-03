import { Book } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-border py-10">
      <div className="container mx-auto px-4 text-center flex flex-col items-center space-y-4">
        {/* Logo and title */}
        <a href="/" className="flex items-center gap-2 text-primary hover:text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
          <Book className="h-7 w-7" aria-hidden="true" />
          <span className="text-xl font-bold tracking-tight">LibraryMS</span>
        </a>

        {/* Tagline */}
        <p className="max-w-md text-muted-foreground text-sm sm:text-base">
          Modern library management made simple, elegant, and accessible for everyone.
        </p>

        {/* Divider line */}
        <div className="w-full max-w-xs border-t border-border"></div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LibraryMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}