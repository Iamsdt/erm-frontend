import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, TrendingUp, Lightbulb } from "lucide-react"
import { Link } from "react-router"

/**
 * AI Hub - Landing page for AI features
 */
const AIHub = () => {
  const aiFeatures = [
    {
      title: "AI Insights",
      description: "Get AI-powered insights about your team's performance and recommendations",
      url: "/ai/insights",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "AI Recommendations",
      description: "Smart recommendations for process improvements and optimizations",
      url: "/ai/recommendations",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-600",
    },
    {
      title: "AI Analytics",
      description: "Advanced analytics powered by machine learning algorithms",
      url: "/ai/analytics",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild>
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          AI & Analytics Hub
        </h1>
        <p className="mt-2 text-muted-foreground">
          Leverage artificial intelligence to optimize your team's workflow and make
          data-driven decisions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {aiFeatures.map((feature) => {
          const IconComponent = feature.icon
          return (
            <Card
              key={feature.title}
              className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${feature.color} h-32 flex items-center justify-center`}>
                <IconComponent className="h-16 w-16 text-white opacity-20" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconComponent className="h-5 w-5" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={feature.url}>Explore</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-0">
        <CardHeader>
          <CardTitle>AI Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm text-gray-300">Active Models</p>
            </div>
            <div>
              <p className="text-3xl font-bold">95%</p>
              <p className="text-sm text-gray-300">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-gray-300">Data Points</p>
            </div>
            <div>
              <p className="text-3xl font-bold">Real-time</p>
              <p className="text-sm text-gray-300">Processing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AIHub
