import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function MapEmbed({ lat, lng, address }) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${
    lng - 0.01
  }%2C${lat - 0.01}%2C${lng + 0.01}%2C${
    lat + 0.01
  }&layer=mapnik&marker=${lat}%2C${lng}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;

  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" aria-hidden />
          <div>
            <h2 className="text-lg font-semibold">Location</h2>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>
        <a
          href={osmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline"
        >
          Open in Maps
        </a>
      </div>
      <div className="aspect-[16/9] w-full">
        <iframe
          title="Property location on map"
          src={src}
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>
    </Card>
  );
}
