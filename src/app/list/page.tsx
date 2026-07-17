import { redirect } from "next/navigation";

export default function ListEquipmentPage() {
  redirect("/portal/listings?new=1");
}
