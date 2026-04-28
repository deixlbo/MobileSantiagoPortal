import { ResidentLayout } from "@/components/resident-layout";
import { useListAnnouncements } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, CalendarDays, MapPin, Share2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

export default function ResidentAnnouncements() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { data: announcements = [], isLoading } = useListAnnouncements({ 
    status: "published",
    type: typeFilter !== "all" ? typeFilter : undefined 
  });

  const handleShare = (title: string) => {
    const text = `Check out this announcement from Brgy. Santiago: ${title}`;
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  return (
    <ResidentLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Barangay Announcements</h2>
            <p className="text-muted-foreground">Stay informed with the latest news, events, and advisories.</p>
          </div>
          <div className="w-full sm:w-48">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Announcements</SelectItem>
                <SelectItem value="Announcement">General</SelectItem>
                <SelectItem value="Event">Events</SelectItem>
                <SelectItem value="Health">Health Advisories</SelectItem>
                <SelectItem value="Meeting">Meetings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-64"></Card>
            ))
          ) : announcements.length === 0 ? (
            <div className="col-span-full text-center py-16 border-2 border-dashed rounded-xl bg-muted/20">
              <Megaphone className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground text-lg">No announcements found for this category.</p>
            </div>
          ) : (
            announcements.map((item) => (
              <Card key={item.id} className="flex flex-col hover-elevate transition-all border-border/50 bg-card overflow-hidden">
                <div className="h-1.5 bg-primary/20 w-full" />
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {item.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 leading-snug">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {item.content}
                  </p>
                  
                  {(item.eventDate || item.location) && (
                    <div className="space-y-2 mt-auto text-xs text-muted-foreground bg-muted/30 p-3 rounded-md border border-border/50">
                      {item.eventDate && (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-primary" />
                          <span className="font-medium">
                            {format(new Date(item.eventDate), "MMMM d, yyyy")} 
                            {item.eventTime && ` • ${item.eventTime}`}
                          </span>
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-start gap-2 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0 border-t border-border/50 p-4">
                  <Button variant="ghost" className="w-full justify-between" onClick={() => setSelectedItem(item)}>
                    Read Full Details <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {selectedItem.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Published {format(new Date(selectedItem.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
              <DialogTitle className="text-2xl leading-tight">{selectedItem.title}</DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap mb-8">
                {selectedItem.content}
              </div>

              {(selectedItem.eventDate || selectedItem.location) && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50 space-y-3">
                  <h4 className="font-semibold text-sm">Event Details</h4>
                  {selectedItem.eventDate && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CalendarDays className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{format(new Date(selectedItem.eventDate), "EEEE, MMMM d, yyyy")}</div>
                        {selectedItem.eventTime && <div className="text-muted-foreground">{selectedItem.eventTime}</div>}
                      </div>
                    </div>
                  )}
                  {selectedItem.location && (
                    <div className="flex items-center gap-3 text-sm pt-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div className="font-medium">{selectedItem.location}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedItem(null)}>Close</Button>
              <Button onClick={() => handleShare(selectedItem.title)}>
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </ResidentLayout>
  );
}
