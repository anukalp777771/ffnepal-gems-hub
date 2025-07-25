import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const SecurityWarning = () => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Security Notice</AlertTitle>
      <AlertDescription>
        This app currently uses frontend-only security which is not suitable for production. 
        For proper security with backend authentication, database, and file storage, please connect to Supabase.
        <div className="mt-2 space-y-1 text-sm">
          <div>• Hardcoded admin credentials should be removed</div>
          <div>• Payment information should be stored securely</div>
          <div>• File uploads need proper validation and storage</div>
          <div>• User sessions need server-side management</div>
        </div>
      </AlertDescription>
    </Alert>
  );
};