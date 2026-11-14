import type { Metadata } from "next";
import CivicHome from "@/components/civic/CivicHome";

export const metadata: Metadata = {
  title: "Vehicle counting infrastructure for parking operators | Bizzi Systems",
  description: "Bizzi is developing camera-free, curb-mounted vehicle counters for controlled parking entrances and exits, with an intended path from count data to operator systems."
};

export default function HomePage(){return <CivicHome/>}
