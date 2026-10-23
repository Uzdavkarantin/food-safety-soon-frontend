// Shapes of the service-page copy in src/messages/{locale}/services.json.

export type FormField =
  | { id: string; label: string; type: "textarea" | "text" | "number"; value: string }
  | { id: string; label: string; type: "select"; options: string[] }
  | { id: string; label: string; type: "file"; hint: string };

export type ServiceForm = {
  title: string;
  submit: string;
  reset: string;
  fields: FormField[];
};

export type ServiceStep = { title: string; text: string };
