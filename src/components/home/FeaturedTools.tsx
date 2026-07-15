import Image from "next/image";
import Link from "next/link";
import { ELDORET_CENTER, SEED_EQUIPMENT, haversineKm } from "@/lib/seed-equipment";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";

function categoryLabel(value: string) {
  return (
    EQUIPMENT_CATEGORIES.find((item) => item.value === value)?.label ?? value
  );
}

export function FeaturedTools() {
  const featured = [...SEED_EQUIPMENT]
    .filter((item) => item.isAvailable)
    .map((item) => ({
      ...item,
      distanceKm: haversineKm(
        ELDORET_CENTER.lat,
        ELDORET_CENTER.lng,
        item.locationLat,
        item.locationLng,
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3);

  return (
    <section className="border-y border-[color:var(--line)] bg-white/35 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-water-700">
              Near Eldoret
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-green-950 sm:text-4xl">
              Climate-smart tools ready to share
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Browse solar pumps, soil kits, and conservation equipment sorted
              from nearest to farthest.
            </p>
          </div>
          <ButtonLink href="/browse" variant="secondary">
            Find tools
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featured.map((item, index) => (
            <Link
              key={item.id}
              href={`/equipment/${item.id}`}
              className={`field-panel-strong group overflow-hidden rounded-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(18,32,24,0.12)] animate-stagger animate-delay-${index + 1}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-water-700">
                  {categoryLabel(item.category)}
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold text-green-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {item.locationLabel} · {item.distanceKm.toFixed(1)} km
                </p>
                <p className="mt-3 text-sm font-semibold text-green-800">
                  {item.ratePerDay.toLocaleString()} KES / day
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
