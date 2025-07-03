import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cyan-50 text-center p-4">
      <Ghost className="h-20 w-20 text-muted-foreground" />
      <h1 className="mt-6 text-3xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
}