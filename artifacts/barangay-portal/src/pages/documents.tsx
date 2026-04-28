import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Lock } from "lucide-react";
import { useListDocumentCategories } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function DocumentsPublic() {
  const { data: categories = [], isLoading } = useListDocumentCategories();

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-12 md:py-20 border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Available Documents</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Browse the catalog of official barangay documents available for request. Registered residents can request these online.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-muted/50"></CardHeader>
                <CardContent className="h-20"></CardContent>
              </Card>
            ))
          ) : (
            categories.map((cat) => (
              <Card key={cat.id} className="flex flex-col h-full hover-elevate transition-all border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">
                      {cat.category}
                    </span>
                    <span className="font-bold text-lg text-foreground">
                      {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(cat.price)}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{cat.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/10">
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full justify-between group">
                      Sign in to Request
                      <Lock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        <div className="mt-16 bg-muted/30 rounded-2xl p-8 text-center max-w-3xl mx-auto border border-border/50">
          <h3 className="text-xl font-semibold mb-2">Not yet registered?</h3>
          <p className="text-muted-foreground mb-6">
            Create your official citizen account to easily request documents, track their status, and avoid long queues at the Barangay Hall.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-8 shadow-sm">
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
