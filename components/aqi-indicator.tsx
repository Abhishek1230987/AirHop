export default function AQIIndicator() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Reference Guide</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Good */}
        <div className="flex flex-col items-center justify-center p-6 bg-green-500 dark:bg-green-700 text-white rounded-lg transition-colors">
          <div className="text-3xl font-bold mb-2">0-50</div>
          <div className="text-lg font-semibold">Good</div>
        </div>

        {/* Moderate */}
        <div className="flex flex-col items-center justify-center p-6 bg-orange-500 dark:bg-orange-700 text-white rounded-lg transition-colors">
          <div className="text-3xl font-bold mb-2">51-100</div>
          <div className="text-lg font-semibold">Moderate</div>
        </div>

        {/* Unhealthy */}
        <div className="flex flex-col items-center justify-center p-6 bg-red-600 dark:bg-red-800 text-white rounded-lg transition-colors">
          <div className="text-3xl font-bold mb-2">101+</div>
          <div className="text-lg font-semibold">Unhealthy</div>
        </div>
      </div>
    </div>
  )
}
