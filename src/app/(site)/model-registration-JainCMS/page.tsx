import { redirect } from "next/navigation";

// Free Jain CMS registration is temporarily redirected to the paid
// /model-registration flow. The URL is kept alive (not deleted) so existing
// shared links / QR codes / posters still resolve.
export default function ModelRegistrationJainCMSPage() {
  redirect("/model-registration");
}
