import { Calendar } from "lucide-react";

interface InfoCardProps {
  title: string;
  date: string;
  image: string;
  excerpt: string;
}

const InfoCard = ({ title, date, image, excerpt }: InfoCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border hover:shadow-lg transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
          <Calendar className="h-3.5 w-3.5" />
          {date}
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
      </div>
    </div>
  );
};

export default InfoCard;
