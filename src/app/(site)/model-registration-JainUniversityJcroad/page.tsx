import { redirect } from "next/navigation";

// Free Jain University (JC Road) registration is temporarily redirected to
// the paid /model-registration flow. The URL is kept alive (not deleted) so
// existing shared links / QR codes / posters still resolve.
export default function ModelRegistrationJainUniversityPage() {
  redirect("/model-registration");
}
