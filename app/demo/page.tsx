"use client";

import { ColorInput } from "@/components/ui/color-input";
import { useColorContext } from "@/theme/use-color-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DemoPage() {
  const { currentColor, error, isLoading } = useColorContext();

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Color Theme Demo</h1>
        <p className="text-muted-foreground">
          Test the error handling with various color inputs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Color Input with Error Handling</CardTitle>
          <CardDescription>
            Try entering invalid colors to see error handling in action
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorInput placeholder="Enter hex color (e.g., #ff0000 or invalid)" />

          <div className="text-muted-foreground text-sm">
            <p>Test cases to try:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                Valid: <code className="rounded bg-gray-100 px-1">#ff0000</code>
                , <code className="rounded bg-gray-100 px-1">ff0000</code>
              </li>
              <li>
                Invalid:{" "}
                <code className="rounded bg-gray-100 px-1">invalid</code>,{" "}
                <code className="rounded bg-gray-100 px-1">#gg0000</code>
              </li>
              <li>
                Too long:{" "}
                <code className="rounded bg-gray-100 px-1">#ff0000000000</code>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Theme Colors</CardTitle>
            <CardDescription>
              {isLoading ? "Loading..." : "Active color palette"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(currentColor).map(([colorType, colors]) => (
                <div key={colorType} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {colorType}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {colors.length} shades
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="h-8 w-8 rounded border"
                        style={{ backgroundColor: color }}
                        title={`${colorType}-${(index + 1) * 100}: ${color}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Status</CardTitle>
            <CardDescription>
              Current error state and loading status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Loading:</span>
                <Badge variant={isLoading ? "default" : "secondary"}>
                  {isLoading ? "Yes" : "No"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Error:</span>
                <Badge variant={error ? "destructive" : "secondary"}>
                  {error ? "Yes" : "No"}
                </Badge>
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-800">
                  Error Details:
                </p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
