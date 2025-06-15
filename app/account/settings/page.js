import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

export default function SettingsCard() {
  return (
    <div className="w-full mx-auto  md:ring-1 md:ring-gray-200 md:rounded-lg md:shadow-md">
      <Card className="w-full md:p-6 ">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* General Section */}
          <div className="px-6 py-2 text-sm font-semibold text-[#B5B5B5]">General</div>

          <div className="border-t border-gray-300 px-6 py-4 flex justify-between items-center cursor-pointer">
            <span className="font-medium">Notification Settings</span>
            <ChevronRight className="h-5 w-5 text-[#B5B5B5]" />
          </div>

          <div className="border-t border-gray-300 px-6 py-4 flex justify-between items-center cursor-pointer">
            <span className="font-medium text-red-500">Delete Account</span>
            <ChevronRight className="h-5 w-5 text-red-500" />
          </div>

          {/* Feedback Section */}
          <div className="border-t  border-gray-300 px-6 py-2 text-sm font-semibold text-[#B5B5B5]">Feedback</div>

          <div className="border-t border-gray-300 px-6 py-4 flex justify-between items-center cursor-pointer">
            <span className="font-medium">Report a Bug</span>
            <ChevronRight className="h-5 w-5 text-[#B5B5B5]" />
          </div>

          <div className="border-t border-gray-300 px-6 py-4 flex justify-between items-center cursor-pointer">
            <span className="font-medium">Send Feedback</span>
            <ChevronRight className="h-5 w-5 text-[#B5B5B5]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

