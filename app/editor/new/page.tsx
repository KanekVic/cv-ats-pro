import { CVEditor } from "@/components/editor/CVEditor";
import { CVContent } from "@/types/cv";
import "../editor.css";

export default function NewCVPage() {
  function handleSave(data: CVContent) {
    console.log("Saving CV:", data);
    // TODO: Save to database
  }

  return <CVEditor onSave={handleSave} />;
}
