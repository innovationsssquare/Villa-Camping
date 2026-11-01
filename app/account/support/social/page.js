"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ExternalLink,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SOCIAL_LINKS } from "@/lib/socialLinks";

const SOCIAL_CHANNELS = [
  {
    name: "Instagram",
    handle: "@thevillacamp",
    url: SOCIAL_LINKS.instagram,
    icon: Instagram,
    iconColor: "text-pink-500",
    bgHover: "hover:border-pink-300 hover:bg-pink-50/50",
  },
  {
    name: "YouTube",
    handle: "@Thevillacamp",
    url: SOCIAL_LINKS.youtube,
    icon: Youtube,
    iconColor: "text-red-600",
    bgHover: "hover:border-red-300 hover:bg-red-50/50",
  },
  {
    name: "Facebook",
    handle: "The Villa Camp",
    url: SOCIAL_LINKS.facebook,
    icon: Facebook,
    iconColor: "text-blue-600",
    bgHover: "hover:border-blue-300 hover:bg-blue-50/50",
  },
  {
    name: "X (Twitter)",
    handle: "@Thevillacamp",
    url: SOCIAL_LINKS.x,
    icon: Twitter,
    iconColor: "text-neutral-900",
    bgHover: "hover:border-neutral-400 hover:bg-neutral-50",
  },
];

const Page = () => {
  const router = useRouter();

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      <Card className="w-full border border-neutral-200 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center space-y-0 pb-4 border-b border-neutral-100">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 cursor-pointer rounded-full hover:bg-neutral-100"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5 text-neutral-700" />
          </Button>
          <div>
            <CardTitle className="text-lg font-bold text-neutral-900">Official Social Media</CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">
              Follow and connect with TheVillaCamp across our official platforms
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {SOCIAL_CHANNELS.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.name}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-white transition-all shadow-2xs group cursor-pointer ${channel.bgHover}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-150 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className={`h-5 w-5 ${channel.iconColor}`} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-neutral-900 group-hover:text-black">
                        {channel.name}
                      </div>
                      <div className="text-xs text-neutral-500 font-medium">
                        {channel.handle}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
