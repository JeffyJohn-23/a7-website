import { redirect } from "next/navigation";

// Free BMS College registration is temporarily redirected to the paid
// /model-registration flow. The URL is kept alive (not deleted) so existing
// shared links / QR codes / posters still resolve.
export default function ModelRegistrationBMSCollegePage() {
  redirect("/model-registration");
}
