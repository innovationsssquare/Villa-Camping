import PropertyDetailsPage from "@/components/Propertyviewcomponents/property-details-page"

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily:
          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <PropertyDetailsPage />
    </div>
  )
}
