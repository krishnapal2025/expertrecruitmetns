import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Star } from "lucide-react";

export default function Testimonials() {
  const { data: testimonials, error, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse">
                <CardContent className="p-6">
                  <div className="bg-gray-200 h-4 w-3/4 mb-4 rounded"></div>
                  <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
                  <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
                  <div className="bg-gray-200 h-4 w-1/2 mb-6 rounded"></div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                    <div>
                      <div className="bg-gray-200 h-4 w-24 mb-1 rounded"></div>
                      <div className="bg-gray-200 h-3 w-32 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Error loading testimonials:", error);
    return null;
  }

  // Render stars for rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ));
  };

  // Prevent rendering if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-12">
          <MessageSquare className="h-8 w-8 text-primary mr-3" />
          <h2 className="text-3xl font-bold">What Our Users Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex mb-4">{renderStars(testimonial.rating)}</div>
                <blockquote className="text-gray-700 italic mb-6">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
