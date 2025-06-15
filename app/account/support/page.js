"use client"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
export default function HelpAndSupport() {
  const [activeSection, setActiveSection] = useState(null)
  const [expandedFaq, setExpandedFaq] = useState(1)
const router=useRouter()
  const handleSectionClick = (section) => {
    setActiveSection(section === activeSection ? null : section)
  }

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "This Is A Sample Faq Question",
      answer:
        "This is a sample faq answer for the respective questions, acting as a placeholder, contents will be changed later.",
    },
    {
      question: "This Is A Sample Faq Question",
      answer:
        "This is a sample faq answer for the respective questions, acting as a placeholder, contents will be changed later.",
    },
    {
      question: "This Is A Sample Faq Question",
      answer:
        "This is a sample faq answer for the respective questions, acting as a placeholder, contents will be changed later.",
    },
    {
      question: "This Is A Sample Faq Question",
      answer:
        "This is a sample faq answer for the respective questions, acting as a placeholder, contents will be changed later.",
    },
    {
      question: "This Is A Sample Faq Question",
      answer:
        "This is a sample faq answer for the respective questions, acting as a placeholder, contents will be changed later.",
    },
  ]

  return (
    <div className="w-full mx-auto md:px-4 py-4 md:py-0">
      <Card className="w-full md:ring-1 ring-gray-300 md:rounded-lg md:p-6 shadow-none">
        <CardHeader>
          <CardTitle className="md:text-xl font-semibold">Help & Support</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Contact Us Section */}
          <div className="px-6 py-2 text-sm font-semibold text-[#B5B5B5]">Contact Us</div>
          <div
           onClick={()=>router.push("/account/support/contactus")}
            className="px-6 py-4 border-b border-gray-300 flex justify-between items-center cursor-pointer"
          >
            <span className="font-medium">Customer Service</span>
            <ChevronRight className="h-5 w-5 text-[#B5B5B5]" />
          </div>

          {/* Social Accounts Section */}
          <div
                     onClick={()=>router.push("/account/support/social")}

            className="px-6 py-4 border-b border-gray-300  flex justify-between items-center cursor-pointer"
          >
            <span className="font-medium">Social Accounts</span>
            <ChevronRight className="h-5 w-5 text-[#B5B5B5]" />
          </div>

          {/* FAQs Section */}
          <div className="px-6 py-4 font-semibold text-sm text-[#B5B5B5] ">General FAQs</div>

          {faqs.map((faq, index) => (
            <div key={index} className="border-t border-gray-300">
              <div
                className="px-6 py-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium">{faq.question}</span>
                {expandedFaq === index ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-[#B5B5B5]" />
                )}
              </div>
              {expandedFaq === index && <div className="px-6 py-4 mb-2 bg-[#E8F2F4] text-[#106C83] text-sm">{faq.answer}</div>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

