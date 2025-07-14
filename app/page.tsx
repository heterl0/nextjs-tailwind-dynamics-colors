"use client";

import { useCallback, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle,
  Info,
  AlertTriangle,
  XCircle,
  Palette,
} from "lucide-react";
import { useColorContext } from "@/theme/use-color-context";

const colorThemes = {
  blue: {
    color: "2b7fff",
  },
  purple: {
    color: "8b5cf6",
  },
  emerald: {
    color: "16b980",
  },
  orange: {
    color: "f97316",
  },
};

export default function ColorThemeShowcase() {
  const [currentTheme, setCurrentTheme] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { setPrimaryColor, currentColor } = useColorContext();

  const handleThemeSelect = (color: string) => {
    setIsDialogOpen(true);
    setCurrentTheme(color);
  };

  const handleConfirmTheme = useCallback(() => {
    setIsDialogOpen(false);
    console.log("currentTheme", currentTheme);
    setPrimaryColor(currentTheme);
  }, [currentTheme, setPrimaryColor]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="blue- container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Color Theme Showcase</h1>
          <p className="mb-6 text-gray-600">
            Pick a color theme to see how all components adapt to your selection
          </p>

          {/* Theme Picker */}
          <Card className="mx-auto mb-8 max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Choose Color Theme
              </CardTitle>
              <CardDescription>
                Current theme: {currentColor?.primary[4]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Object.entries(colorThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeSelect(theme.color)}
                    className={`rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                      currentColor?.primary[4] === theme.color
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: `${theme.color}` }}
                      />
                      <span className="text-sm font-medium">{key}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Component Showcase */}
        <div className="grid gap-8">
          {/* Buttons Section */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>
                Various button styles using custom colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary-500 hover:bg-primary-600 text-white">
                  Primary
                </Button>
                <Button className="bg-success-500 hover:bg-success-600 text-white">
                  Success
                </Button>
                <Button className="bg-info-500 hover:bg-info-600 text-white">
                  Info
                </Button>
                <Button className="bg-warning-500 hover:bg-warning-600 text-white">
                  Warning
                </Button>
                <Button className="bg-danger-500 hover:bg-danger-600 text-white">
                  Danger
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-50"
                >
                  Primary Outline
                </Button>
                <Button
                  variant="outline"
                  className="border-success-500 text-success-500 hover:bg-success-50"
                >
                  Success Outline
                </Button>
                <Button
                  variant="outline"
                  className="border-info-500 text-info-500 hover:bg-info-50"
                >
                  Info Outline
                </Button>
                <Button
                  variant="outline"
                  className="border-warning-500 text-warning-500 hover:bg-warning-50"
                >
                  Warning Outline
                </Button>
                <Button
                  variant="outline"
                  className="border-danger-500 text-danger-500 hover:bg-danger-50"
                >
                  Danger Outline
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                Status badges with custom colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-primary-500 text-white">
                  Primary Badge
                </Badge>
                <Badge className="bg-success-500 text-white">
                  Success Badge
                </Badge>
                <Badge className="bg-info-500 text-white">Info Badge</Badge>
                <Badge className="bg-warning-500 text-white">
                  Warning Badge
                </Badge>
                <Badge className="bg-danger-500 text-white">Danger Badge</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <Badge
                  variant="outline"
                  className="border-primary-500 text-primary-500"
                >
                  Primary
                </Badge>
                <Badge
                  variant="outline"
                  className="border-success-500 text-success-500"
                >
                  Success
                </Badge>
                <Badge
                  variant="outline"
                  className="border-info-500 text-info-500"
                >
                  Info
                </Badge>
                <Badge
                  variant="outline"
                  className="border-warning-500 text-warning-500"
                >
                  Warning
                </Badge>
                <Badge
                  variant="outline"
                  className="border-danger-500 text-danger-500"
                >
                  Danger
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>
                Alert components with custom styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-primary-200 bg-primary-50">
                  <Info className="text-primary-500 h-4 w-4" />
                  <AlertTitle className="text-primary-700">
                    Primary Alert
                  </AlertTitle>
                  <AlertDescription className="text-primary-600">
                    This is a primary alert with custom primary colors.
                  </AlertDescription>
                </Alert>

                <Alert className="border-success-200 bg-success-50">
                  <CheckCircle className="text-success-500 h-4 w-4" />
                  <AlertTitle className="text-success-700">
                    Success Alert
                  </AlertTitle>
                  <AlertDescription className="text-success-600">
                    This is a success alert indicating a successful operation.
                  </AlertDescription>
                </Alert>

                <Alert className="border-info-200 bg-info-50">
                  <Info className="text-info-500 h-4 w-4" />
                  <AlertTitle className="text-info-700">Info Alert</AlertTitle>
                  <AlertDescription className="text-info-600">
                    This is an informational alert with helpful information.
                  </AlertDescription>
                </Alert>

                <Alert className="border-warning-200 bg-warning-50">
                  <AlertTriangle className="text-warning-500 h-4 w-4" />
                  <AlertTitle className="text-warning-700">
                    Warning Alert
                  </AlertTitle>
                  <AlertDescription className="text-warning-600">
                    This is a warning alert that requires attention.
                  </AlertDescription>
                </Alert>

                <Alert className="border-danger-200 bg-danger-50">
                  <XCircle className="text-danger-500 h-4 w-4" />
                  <AlertTitle className="text-danger-700">
                    Danger Alert
                  </AlertTitle>
                  <AlertDescription className="text-danger-600">
                    This is a danger alert indicating an error or critical
                    issue.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Cards Section */}
          <Card>
            <CardHeader>
              <CardTitle>Colored Cards</CardTitle>
              <CardDescription>Cards with custom color accents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-l-primary-500 border-l-4">
                  <CardHeader>
                    <CardTitle className="text-primary-700">
                      Primary Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      This card uses primary colors for accents and headers.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-success-500 border-l-4">
                  <CardHeader>
                    <CardTitle className="text-success-700">
                      Success Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      This card uses success colors for positive feedback.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-info-500 border-l-4">
                  <CardHeader>
                    <CardTitle className="text-info-700">Info Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      This card uses info colors for informational content.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-warning-500 border-l-4">
                  <CardHeader>
                    <CardTitle className="text-warning-700">
                      Warning Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      This card uses warning colors for cautionary content.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-danger-500 border-l-4">
                  <CardHeader>
                    <CardTitle className="text-danger-700">
                      Danger Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      This card uses danger colors for critical content.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Theme Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to change the theme to{" "}
                {currentColor?.primary[4]}? This will update all components on
                the page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              {currentColor?.primary[4] && (
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-lg"
                    style={{
                      backgroundColor: `${currentColor?.primary[4]}`,
                    }}
                  />
                  <div>
                    <p className="font-medium">{currentColor?.primary[4]}</p>
                    <p className="text-sm text-gray-500">
                      Primary color preview
                    </p>
                  </div>
                </div>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmTheme}>
                Apply Theme
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
